<?php

class Squeezol_Payment_IndexController extends Mage_Core_Controller_Front_Action {

    protected $_ses;

    public function preDispatch () {
        parent::preDispatch();

        /*if (!Mage::getSingleton('customer/session')->authenticate($this)) {
            $this->getResponse()->setRedirect(Mage::helper('customer')->getLoginUrl());

            $this->setFlag('', self::FLAG_NO_DISPATCH, true);
        }*/

        $this->_ses = $_SESSION;
    }

    public function indexAction () {
        $this->loadLayout();
        $this->renderLayout();
        return $this;
    }

    public function gatewayAction () {

        $lastOrderId = isset($_GET['oid'])
                     ? $_GET['oid']
                     : null;

        if (!$lastOrderId) {
            $lastOrderId = Mage::getSingleton('checkout/session')
                                   ->getLastRealOrderId();
        }

        if (!$lastOrderId) {
            die();
        } else {
            $_SESSION['curr_order'] = $lastOrderId;
        }

        $sql   = 'SELECT * FROM squeezol_groups WHERE order_id = ' . addslashes($lastOrderId);
        $group = Mage::getSingleton('core/resource') ->getConnection('core_read')->fetchRow($sql);

        if (!$group) {
            $customerId = Mage::getSingleton('customer/session')->getCustomer()->getId();
            $sql = 'INSERT INTO squeezol_groups VALUES (' . $customerId . ', ' . $lastOrderId . ', null);';
            $group = Mage::getSingleton('core/resource') ->getConnection('core_write')->query($sql);
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
            $endpoint  = new SqueezolProductsEndpoint($_SESSION['squeezolToken'] , $prod_data);

            $data = $endpoint->create_product();
        } else {
            if(!empty($_SESSION['squeezolToken'])) {
                $token = $_SESSION['squeezolToken'];

                if($_SERVER['REQUEST_METHOD'] == 'POST') {
                    $endpoint = new SqueezolGroupsEndpoint($token, $_POST);
                    $res = $endpoint->create_group();

                    if ($res['status'] !== 'error') {
                        $sql = 'UPDATE squeezol_groups SET group_id = ' . $res['group_id'] . ' WHERE order_id = ' . addslashes($_SESSION['curr_order']);
                        Mage::getSingleton('core/resource') ->getConnection('core_write')->query($sql);
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

            $_SESSION['squeezolToken'] = $info['access_token'];
            if ($_SESSION['fromReview']) {
                header('Location: ' . $basePath . $paramsModel::REVIEW_PAGE);
                unset($_SESSION['fromReview']);
            } else {
                header('Location: ' . $basePath . $paramsModel::PAY_PAGE);
            }
            error_log('Access token' . "{$_SESSION['squeezolToken']}");
            die();
        }
    }

    public function reviewAction () {

        if (!isset($_SESSION['squeezolToken'])) {

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
            $_SESSION['fromReview'] = true;

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

                $_SESSION['squeezolToken'] = $info['access_token'];
                header('Location: ' . $basePath . $paramsModel::REVIEW_PAGE);
                error_log('Access token' . "{$_SESSION['squeezolToken']}");
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

        if(!empty($_SESSION['squeezolToken']))
        {
          $token = $_SESSION['squeezolToken'];

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

        if(!empty($_SESSION['squeezolToken']))
        {
          $token = $_SESSION['squeezolToken'];
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

        $sql   = 'SELECT * FROM squeezol_groups WHERE group_id = ' . addslashes($data['group']);
        $group = Mage::getSingleton('core/resource') ->getConnection('core_read')->fetchRow($sql);

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
