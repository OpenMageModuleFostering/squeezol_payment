<?php

class Squeezol_Payment_Model_PaymentMethod extends Mage_Payment_Model_Method_Abstract {

    protected $_code = 'squeezol_payment';

    public function getOrderPlaceRedirectUrl () {
        return Mage::getUrl('squeezol/index/gateway');
    }
}
