<?php

class Squeezol_Payment_Model_Session extends Mage_Core_Model_Session_Abstract {

    public function _construct () {
        $this->init('squeezol');
    }
}
