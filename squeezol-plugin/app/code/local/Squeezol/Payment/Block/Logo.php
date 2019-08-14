<?php

class Squeezol_Payment_Block_Logo extends Mage_Payment_Block_Form {
    protected function _construct () {
        parent::_construct();
        $this->setTemplate('squeezol_payment/logo.phtml');
    }
}
