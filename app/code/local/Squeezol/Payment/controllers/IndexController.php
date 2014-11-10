<?php

class Squeezol_Payment_IndexController extends Mage_Core_Controller_Front_Action {

    protected $_ses;

    public function preDispatch () {
        parent::preDispatch();

        $this->_ses = Mage::getSingleton('squeezol_payment/session');
    }

    public function getSession () {
        return $this->_ses;
    }

    public function indexAction () {
        $this->loadLayout();
        $this->renderLayout();
        return $this;
    }

    public function gatewayAction () {

        $lastOrderId = isset($_GET['oid']) ? $_GET['oid'] : null;

        if (!$lastOrderId) {
            $lastOrderId = Mage::getSingleton('checkout/session')
                                   ->getLastRealOrderId();
        }

        if (!$lastOrderId) {
            die();
        }

        $this->getSession()->setCurrOrder($lastOrderId);
        $group = Mage::helper('squeezol_payment')->getGroupByOrder($lastOrderId);

        if (!$group) {
            Mage::helper('squeezol_payment')->insertOrder($lastOrderId);
        }

        $this->loadLayout();
        $this->renderLayout();

        return $this;
    }

    public function payAction () {
        require_once Mage::getBaseDir('lib') . '/Squeezol/endpoints.php';

        $UNAUTH_ERROR       = array("status" => "error", "error" => "unauth_request");
        $FORM_OK            = array("status" => "ok");
        $INVALID_FORM_ERROR = array("status" => "error", "error" => "form_error" );
        $BAD_REQUEST        = array("status" => "error", "error" => "bad_request");

        if (empty($_POST)) {
            $helper    = Mage::helper('squeezol_payment');
            $prod_data = $helper->getJsonProductsData();
            $endpoint  = new SqueezolProductsEndpoint($this->getSession()->getSqueezolToken() , $prod_data);

            $data = $endpoint->create_product();
        } else {
            if(!empty($this->getSession()->getSqueezolToken())) {
                $token = $this->getSession()->getSqueezolToken();

                if($_SERVER['REQUEST_METHOD'] == 'POST') {
                    $endpoint = new SqueezolGroupsEndpoint($token, $_POST);
                    $res = $endpoint->create_group();

                    if ($res['status'] !== 'error') {
                        Mage::helper('squeezol_payment')->updateGroup($res['group_id'], $this->getSession()->getCurrOrder());
                    }

                } else if($_SERVER['REQUEST_METHOD'] == 'GET') {
                    $endpoint = new SqueezolGroupsEndpoint($token, $_POST);
                    $res = $endpoint->get_group();
                } else {
                    $ret = $BAD_REQUEST;
                }

                if($endpoint->isValid()) {
                    $ret = $res;
                } else {
                    $ret = $res;
                }
            } else {
                $ret = $UNAUTH_ERROR;
            }

            echo json_encode($ret);
            die();
        }

        $this->loadLayout();
        $this->renderLayout();

        return $this;
    }

    public function oauthAction () {
        require_once Mage::getBaseDir('lib') . '/oauth2/Client.php';
        require_once Mage::getBaseDir('lib') . '/oauth2/GrantType/IGrantType.php';
        require_once Mage::getBaseDir('lib') . '/oauth2/GrantType/AuthorizationCode.php';

        $model       = Mage::getModel('squeezol_payment/paymentMethod');
        if ($model->getConfigData('use_sandbox') == 1) {
            $paramsModel = Mage::getModel('squeezol_payment/paramsandbox');
        } else {
            $paramsModel = Mage::getModel('squeezol_payment/params');
        }

        $app_id      = $model->getConfigData('app_id');
        $secret      = $model->getConfigData('app_secret');
        $basePath    = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_LINK);

        $callbackUrl = $basePath . $paramsModel::CALLBACK_URL;

        $client = new OAuth2\Client($app_id, $secret);

        if (!isset($_GET['code'])) {
            $extra_parameters = array('scope' => 'create+pay');
            $auth_url = $client->getAuthenticationUrl($paramsModel::AUTHORIZATION_URL, $callbackUrl, $extra_parameters);
            header('Location: ' . $auth_url);
            die('Redirect');
        } else {
            $params   = array('code' => $_GET['code'], 'redirect_uri' => $callbackUrl);
            $response = $client->getAccessToken($paramsModel::ACCESS_TOKEN_URL, 'authorization_code', $params);
            $info     = $response['result'];

            $client->setAccessToken($info['access_token']);

            $this->getSession()->setSqueezolToken($info['access_token']);

            if ($this->getSession()->getFromReview()) {
                header('Location: ' . $basePath . $paramsModel::REVIEW_PAGE);
                $this->getSession()->unsFromReview();
            } else {
                header('Location: ' . $basePath . $paramsModel::PAY_PAGE);
            }
            die();
        }
    }

    public function reviewAction () {

        if (empty($this->getSession()->getSqueezolToken())) {

            require_once Mage::getBaseDir('lib') . '/oauth2/Client.php';
            require_once Mage::getBaseDir('lib') . '/oauth2/GrantType/IGrantType.php';
            require_once Mage::getBaseDir('lib') . '/oauth2/GrantType/AuthorizationCode.php';

            $model       = Mage::getModel('squeezol_payment/paymentMethod');
            if ($model->getConfigData('use_sandbox') == 1) {
                $paramsModel = Mage::getModel('squeezol_payment/paramsandbox');
            } else {
                $paramsModel = Mage::getModel('squeezol_payment/params');
            }

            $app_id      = $model->getConfigData('app_id');
            $secret      = $model->getConfigData('app_secret');
            $basePath    = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_LINK);

            $callbackUrl = $basePath . $paramsModel::CALLBACK_URL;
            $this->getSession()->setFromReview(true);

            $client = new OAuth2\Client($app_id, $secret);

            if (!isset($_GET['code'])) {
                $extra_parameters = array('scope' => 'create+pay');
                $auth_url = $client->getAuthenticationUrl($paramsModel::AUTHORIZATION_URL, $callbackUrl, $extra_parameters);
                header('Location: ' . $auth_url);
                die('Redirect');
            } else {
                $params   = array('code' => $_GET['code'], 'redirect_uri' => $callbackUrl);
                $response = $client->getAccessToken($paramsModel::ACCESS_TOKEN_URL, 'authorization_code', $params);
                $info     = $response['result'];

                $client->setAccessToken($info['access_token']);

                $this->getSession()->setSqueezolToken($info['access_token']);
                header('Location: ' . $basePath . $paramsModel::REVIEW_PAGE);
                die();
            }
        }

        $this->loadLayout();
        $this->renderLayout();

        return $this;
    }

    public function invitationAction () {

        $this->loadLayout();
        $this->renderLayout();

        return $this;
    }

    public function digestAction () {

        $this->loadLayout();
        $this->renderLayout();

        return $this;
    }

    public function getinvitationAction () {
        require_once Mage::getBaseDir('lib') . '/Squeezol/endpoints.php';

        if(!empty($this->getSession()->getSqueezolToken()))
        {
          $token = $this->getSession()->getSqueezolToken();

          if (!empty($_POST))
          {
            $endpoint = new SqueezolInvitationEndpoint($token, $_POST);
            $res = $endpoint->update_invitation();
          }
          else
          {
            $endpoint = new SqueezolInvitationEndpoint($token, $_GET);
            $res = $endpoint->get_invitation();
          }
          if($endpoint->isValid())
          {
            $ret = $FORM_OK;
            $ret = $res;
          }
          else
          {
            $ret = $INVALID_FORM_ERROR;
            foreach($endpoint->getErrors() as $i => $value)
            {
              $ret[$i] = $value;
            }
          }
        } else {
          $ret = $UNAUTH_ERROR;
        }
        echo json_encode($ret);
    }

    public function getdigestAction () {
        require_once Mage::getBaseDir('lib') . '/Squeezol/endpoints.php';

        if(!empty($this->getSession()->getSqueezolToken()))
        {
          $token = $this->getSession()->getSqueezolToken();

          if($_SERVER['REQUEST_METHOD'] == 'POST')
          {
            $endpoint = new SqueezolDigestEndpoint($token, $_POST);
            $res = $endpoint->update_digest();
          }
          else if($_SERVER['REQUEST_METHOD'] == 'GET')
          {
            $endpoint = new SqueezolDigestEndpoint($token, $_GET);
            $res = $endpoint->get_digest();
          }
          else
          {
            $ret = $BAD_REQUEST;
          }
          if($endpoint->isValid())
          {
            $ret = $res;
          }
          else
          {
            $ret = $res;
          }
        } else {
          $ret = $UNAUTH_ERROR;
        }
        echo json_encode($ret);
    }

    public function ipnAction () {
        $payload = file_get_contents('php://input');
        $data    = json_decode($payload, true);

        $group = Mage::helper('squeezol_payment')->getGroupByOrder($data['group']);

        $order = Mage::getModel('sales/order')->loadByIncrementId($group['order_id']);

        if ($data['status'] == 'S') {
            $order->setStatus(Mage_Sales_Model_Order::STATE_COMPLETE);
            $order->save();
        } else {
            $order->setStatus(Mage_Sales_Model_Order::STATE_CANCELED);
            $order->cancel()->save();
        }

        echo 'OK';
    }
}
