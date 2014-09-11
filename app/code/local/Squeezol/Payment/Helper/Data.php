<?php
class Squeezol_Payment_Helper_Data extends Mage_Core_Helper_Abstract {
    protected $_ses;

    public function getOrderItems () {
        $this->_ses = $_SESSION;

        $salesModel = Mage::getModel('sales/order');
        $order_id   = $this->_ses['checkout']['last_real_order_id'];

        if ($order_id) {
            $order_data = $salesModel->loadByIncrementId($order_id)->getAllItems();
        }

        return $order_data;
    }

    public function getOrderData () {
        $this->_ses = $_SESSION;

        $salesModel = Mage::getModel('sales/order');
        $order_id   = $this->_ses['checkout']['last_real_order_id'];

        if ($order_id) {
            $order_data = $salesModel->loadByIncrementId($order_id)->getData();
        }

        return $order_data;
    }

    public function getProductsIds () {
        $items = $this->getOrderItems();
        $ids   = array();

        foreach ($items as $item) {
            $data = $item->getData();
            $ids[] = $data['sku'];
        }

        return $ids;
    }

    public function getJsonProductsData () {
        $items = $this->getOrderItems();

        $data = array();

        foreach ($items as $i) {
            $info = $i->getData();
            $product = Mage::getModel('catalog/product')->load($info['product_id']);
            $image = $imageUrl = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA) . 'catalog/product' . $product->getImage();
            $curr  = Mage::app()->getStore()->getCurrentCurrencyCode();

            $data[] = array(
                'name'           => $info['name'],
                'image'          => $image,
                'description'    => $product->getShortDescription(),
                'product_id'     => $info['sku'],
                'url'            => $product->getProductUrl(),
                'price'          => number_format($info['price'], 2),
                'price_currency' => $curr
            );
        }

        return $data;
    }

    public function squeezol_call ($url, $squeezolToken, $data) {
        $ch = curl_init();
    }

    public function getPartnerId () {
        $model       = Mage::getModel('squeezol_payment/paymentMethod');
        return $model->getConfigData('app_id');
    }

    public function getGroupsData () {
        require_once Mage::getBaseDir('lib') . '/Squeezol/endpoints.php';

        $endpoint  = new SqueezolGetGroupsEndpoint($_SESSION['squeezolToken'] , array());
        $data = $endpoint->get_groups();

        return json_decode($data['groups'], true);
    }
}
