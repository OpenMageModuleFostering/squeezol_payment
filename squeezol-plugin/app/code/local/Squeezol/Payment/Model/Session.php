<?php

class Squeezol_Payment_Model_Session extends Mage_Core_Model_Session_Abstract {

    public function __construct () {
        $namespace = 'squeezol';
        $namespace .= '_' . (Mage::app()->getStore()->getWebsite()->getCode());

        $this->init($namespace);
        Mage::dispatchEvent('squeezol_session_init', array('squeezol_session' => $this));
    }
}
