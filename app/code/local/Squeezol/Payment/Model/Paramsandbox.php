<?php

class Squeezol_Payment_Model_Paramsandbox extends Mage_Core_Model_Abstract {

    const CALLBACK_URL      = 'squeezol/index/oauth';
    const REQUEST_TOKEN_URL = 'https://sandbox.squeezol.com/api/oauth2/request_token/';
    const ACCESS_TOKEN_URL  = 'https://sandbox.squeezol.com/api/oauth2/access_token/';
    const AUTHORIZATION_URL = 'https://sandbox.squeezol.com/plugin/authorize/';

    const PAY_PAGE          = 'squeezol/index/pay';
    const REVIEW_PAGE       = 'squeezol/index/review';

    const RESOURCE_USER_URL       = 'https://sandbox.squeezol.com/api/user/';
    const RESOURCE_GROUP_URL      = 'https://sandbox.squeezol.com/api/group/create/.json';
    // TODO: verificare funzioanmento, test in corso
    #const RESOURCE_GROUP_NEW_URL      = 'https://test.squeezol.com/api/group/create_new/.json';
    const RESOURCE_PRODUCT_URL    = 'https://sandbox.squeezol.com/api/product/create/';
    const RESOURCE_DIGEST_URL     = 'https://sandbox.squeezol.com/api/group/digest/';
    const RESOURCE_INVITATION_URL = 'https://sandbox.squeezol.com/api/group/invitation/';
    const RESOURCE_ADDPRODUCT_URL = 'https://sandbox.squeezol.com/api/partner/add_product/';
    const RESOURCE_GET_GROUPS_URL = 'https://sandbox.squeezol.com/api/groups/';

    public function __construct () {
        $this->_init('squeezol_payment/params');
        parent::__construct();
    }
}
