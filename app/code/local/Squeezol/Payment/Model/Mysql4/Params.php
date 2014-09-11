<?php

class Squeezol_Payment_Model_Mysql4_Params extends Mage_Core_Model_Mysql4_Abstract {

    public function _construct () {
        $this->_init('squeezol_payment/params', 'param_id');
    }
}
