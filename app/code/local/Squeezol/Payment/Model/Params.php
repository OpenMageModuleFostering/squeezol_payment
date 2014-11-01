<?php

class Squeezol_Payment_Model_Params extends Mage_Core_Model_Abstract {

    const CALLBACK_URL      = 'squeezol/index/oauth';
    const REQUEST_TOKEN_URL = 'https://test.squeezol.com/api/oauth2/request_token/';
    const ACCESS_TOKEN_URL  = 'https://test.squeezol.com/api/oauth2/access_token/';
    const AUTHORIZATION_URL = 'https://test.squeezol.com/api/oauth2/authorize/';

    const PAY_PAGE          = 'squeezol/index/pay';
    const REVIEW_PAGE       = 'squeezol/index/review';

    const RESOURCE_USER_URL       = 'https://test.squeezol.com/api/user/';
    const RESOURCE_GROUP_URL      = 'https://test.squeezol.com/api/group/create/.json';
    const RESOURCE_PRODUCT_URL    = 'https://test.squeezol.com/api/product/create/';
    const RESOURCE_DIGEST_URL     = 'https://test.squeezol.com/api/group/digest/';
    const RESOURCE_INVITATION_URL = 'https://test.squeezol.com/api/group/invitation/';
    const RESOURCE_ADDPRODUCT_URL = 'https://test.squeezol.com/api/partner/add_product/';
    const RESOURCE_GET_GROUPS_URL = 'https://test.squeezol.com/api/groups/';

    public function __construct () {
        $this->_init('squeezol_payment/params');
        parent::__construct();
    }
}
