<?php

class Squeezol_Payment_Block_Start extends Mage_Core_Block_Template {

    protected $_ses;

    public function getOrderItems () {
        $this->_ses = $_SESSION;

        $salesModel = Mage::getModel('sales/order');
        $order_id   = $this->_ses['curr_order'];

        if ($order_id) {
            $order_data = $salesModel->loadByIncrementId($order_id)->getAllItems();
        }

        return $order_data;
    }

    public function getOrderData () {
        $this->_ses = $_SESSION;

        $salesModel = Mage::getModel('sales/order');
        $order_id   = $this->_ses['curr_order'];

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

            $data[] = array(
                'name'        => $info['name'],
                'image'       => $image,
                'description' => $product->getShortDescription(),
                'product_id'  => $info['sku'],
                'url'         => $product->getProductUrl()
            );
        }

        return json_encode($data);
    }

}
