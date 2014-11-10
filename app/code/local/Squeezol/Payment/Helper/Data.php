<?php
class Squeezol_Payment_Helper_Data extends Mage_Core_Helper_Abstract {
    protected $_ses;

    public function getGTableName () {
        return Mage::getSingleton('core/resource')->getTableName('squeezol_groups');
    }

    public function getOrderItems () {
        $this->_ses = Mage::getSingleton('squeezol_payment/session');

        $salesModel = Mage::getModel('sales/order');
        $order_id   = $this->_ses->getCurrOrder();

        if ($order_id) {
            $order_data = $salesModel->loadByIncrementId($order_id)->getAllItems();
        }

        return $order_data;
    }

    public function getOrderData () {
        $this->_ses = Mage::getSingleton('squeezol_payment/session');

        $salesModel = Mage::getModel('sales/order');
        $order_id   = $this->_ses->getCurrOrder();

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
        $this->_ses = Mage::getSingleton('squeezol_payment/session');

        $endpoint  = new SqueezolGetGroupsEndpoint($this->_ses->getSqueezolToken(), array());
        $data = $endpoint->get_groups();

        return json_decode($data['groups'], true);
    }

    public function getGroupByOrder($lastOrderId) {
        $sql  = 'SELECT * FROM ' . $this->getGTableName() . ' WHERE order_id = :order';
        $bind = array(
            'order' => $lastOrderId
        );

        $group = Mage::getSingleton('core/resource') ->getConnection('core_read')->fetchRow($sql, $bind);

        return $group;
    }

    public function insertOrder ($lastOrderId) {
        $customerId = Mage::getSingleton('customer/session')->getCustomer()->getId();

        if ($customerId) {
            $sql = 'INSERT INTO ' . $this->getGTableName() . ' VALUES (:customer, :order, null);';

            $bind = array(
                'customer' => $customerId,
                'order'    => $lastOrderId
            );

            $group = Mage::getSingleton('core/resource') ->getConnection('core_write')->query($sql, $bind);
        }
    }

    public function updateGroup ($group, $order) {
        $sql  = 'UPDATE ' . $this->getGTableName() . ' SET group_id = :group WHERE order_id = :order';

        $bind = array(
            'group' => $group,
            'order' => $order
        );

        Mage::getSingleton('core/resource') ->getConnection('core_write')->query($sql, $bind);
    }
}
