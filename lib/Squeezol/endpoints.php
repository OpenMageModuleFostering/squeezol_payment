<?php

$model1 = Mage::getModel('squeezol_payment/paymentMethod');

if ($model1->getConfigData('use_sandbox') == 1) {

    $model = Mage::getModel('squeezol_payment/paramsandbox');

} else {

    $model = Mage::getModel('squeezol_payment/params');
}


define('RESOURCE_GROUP_URL',      $model::RESOURCE_GROUP_URL);
define('RESOURCE_INVITATION_URL', $model::RESOURCE_INVITATION_URL);
define('RESOURCE_PRODUCT_URL',    $model::RESOURCE_PRODUCT_URL);
define('RESOURCE_DIGEST_URL',     $model::RESOURCE_DIGEST_URL);
define('RESOURCE_ADDPRODUCT_URL', $model::RESOURCE_ADDPRODUCT_URL);
define('RESOURCE_GET_GROUPS_URL', $model::RESOURCE_GET_GROUPS_URL);

class SqueezolEndpoint
{
  /* Base class for Squeezol API call */
  protected $headers = array();
  protected $raw_response = Null;
  protected $response = Null;
  protected $error_class = Exception;
  protected $url = Null;
  protected $data = array();

  const HTTP_METHOD_GET = 'GET';
  const HTTP_METHOD_PUT = 'PUT';
  const HTTP_METHOD_DELETE = 'DELETE';
  const HTTP_METHOD_HEAD = 'HEAD';
  const HTTP_METHOD_PATCH = 'PATCH';

  /* Constructor */
  function __construct($user_token, $data)
  {
    $this->build_headers($user_token);
    $this->prepare_data($data);
  }

  private function build_headers($user_token)
  {
    if(!empty($user_token))
    {
      $this->headers['Authorization'] = "Bearer " . $user_token;
    }
    $this->headers['Content-Type'] = 'application/json';
    $this->headers['Referer'] = 'http' . (isset($_SERVER['HTTPS']) ? 's' : '') . '://' . "{$_SERVER['HTTP_HOST']}/{$_SERVER['REQUEST_URI']}";
    return;
  }

  protected function prepare_data($data)
  {
    /*foreach ($data as $i => $value) {
      $this->data[$i] = $value;
    }*/
    return;
  }

  public function call($method='POST')
  {
    $u = new UrlRequest;
    $this->raw_response = $u->run($this->url, $this->data, $this->headers, $method);
    /*echo 'Url:'      . $this->url . '<br>';
    echo 'Headers:'  . json_encode($this->headers) . '<br>';
    echo 'Request:'  . json_encode($this->data) . '<br>';
    echo 'Response:' . $this->raw_response;*/
    error_log('url is' . $this->url);
    error_log('headers are: ' . json_encode($this->headers));
    error_log('request is: ' . json_encode($this->data));
    error_log('response is: ' . $this->raw_response);
    $this->response = json_decode($this->raw_response, true);
  }
}

class URLRequest
{
  public function __construct()
  {
    if (!extension_loaded('curl')) 
    {
      throw new $error_class('The PHP exention curl must be installed to use this library.', Exception::CURL_NOT_FOUND);
    }
  }

  public function run($url, $data, $headers, $method='POST'){
    // create curl resource
    $ch = curl_init();
    error_log("Data: " . json_encode($data));
    // set url
    if ($method == 'GET')
    {
      $new_url = $url . "?";
      foreach($data as $i => $value)
      {
        $new_url = $new_url . urlencode($i);
        $new_url = $new_url . '=';
        $new_url = $new_url . urlencode($value) . '&';
      }
      $new_url = rtrim($new_url, '&');
      curl_setopt($ch, CURLOPT_URL, $new_url); 
    } else {
      curl_setopt($ch, CURLOPT_URL, $url); 
      if ($method == 'POST')
      {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
      }
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $this->convert_header($headers));
    // TODO: Only for testing purposes
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);    
    // $output contains the output string
    $output = curl_exec($ch);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    error_log("Status code: " . $http_status);
    if($http_status == 500){
      return;
    }
    // close curl resource to free up system resources
    curl_close($ch);   
    
    return $output;
  }

  private function convert_header($header)
  {
    $toSend = array();
    foreach($header as $i => $value)
    {
      array_push($toSend, $i . ": " . $value);
    }
    return $toSend;
  }
}

class SqueezolGroupsEndpoint extends SqueezolEndpoint
{
  /*
    Models the group operations.
  */
  protected $url = RESOURCE_GROUP_URL;

  protected function prepare_data($data)
  {
    foreach ($data as $i => $value) 
    {
      if($i == 'money'){
        $this->data['amount'] = $value;
      } else if ($i == 'money_currency'){
        $this->data['currency'] = $value;
      } else if ($i == 'products'){
        $this->data['products'] = json_decode($value);
      } else if ($i == 'firstUrl') {
      	$this->data['invitation_url'] = $value;
      } else if ($i == 'secondUrl') {
      	$this->data['digest_url'] = $value;
      }
			else {
        $this->data[$i] = $value;
      }
    }
    $this->data['partner'] = Mage::helper('squeezol_payment')->getPartnerId();
    return;
  }

  public function create_group()
  {
    $this->call('POST');
    return $this->response;
  }

  public function get_group()
  {
    $this->call('GET');
    return $this->response;
  }

  public function getError()
  {
    return $this->response['error'];
  }

  public function getErrors()
  {
    $ret = array();
    $err = array();
    $resp = $this->response;
    if(!empty($resp['non_field_errors']))
    {
      $ret['non_field_errors'] = $resp['non_field_errors'];
      $indexCompleted = array_search('non_field_errors', $resp);
      unset($resp[$indexCompleted]);
    }
    else{
      foreach($resp as $i => $value)
      {
        if($i != 'status')
        {
          $err[$i] = $value;
        }
      }
      $ret['genericerror'] = $err;
   }
   $ret['status'] = $resp['status'];
   return $ret;
  }

  public function isValid()
  {
    if(empty($this->response['status']))
    {
      return False;
    }
    if($this->response['status'] == 'ok')
    {
      return True;
    }
    return False;
  }
}

class SqueezolProductsEndpoint extends SqueezolEndpoint
{
  /*
    Models the products operations
  */
  protected $url = RESOURCE_ADDPRODUCT_URL;

  public function __construct($user_token, $data) {
    parent::__construct($user_token, $data);

    $this->url = $this->url;
  }


  protected function prepare_data($data)
  {
    $tot_data = array();
    foreach ($data as $i => $value) 
    {
      $tot_data[$i] = $value;
      $tot_data[$i]['partner'] = Mage::helper('squeezol_payment')->getPartnerId();
    }

    $this->data['products'] = $tot_data;
    
    return;
  }

  public function create_product()
  {
    $this->call('POST');
    return $this->response;
  }

  public function get_product()
  {
    $this->call('GET');
    return $this->response;
  }

  public function getError()
  {
    return $this->response['error'];
  }

}

class SqueezolDigestEndpoint extends SqueezolEndpoint {
  /*
    Models the digest operations
  */
  protected $url = RESOURCE_DIGEST_URL;

  public function __construct($user_token, $data) {
    parent::__construct($user_token, $data);
  }
  
  protected function prepare_data($data)
  {
    foreach ($data as $i => $value) 
    {
      if($i == 'participant_id'){
        $this->data['participant_id'] = $value;
      } else if ($i == 'action'){
        $this->data['action'] = $value;
      } else if ($i == 'single_amount'){
        $this->data['single_amount'] = $value;
      } else {
        $this->data[$i] = $value;
      }
    }
    $this->data['partner'] = Mage::helper('squeezol_payment')->getPartnerId();
    return;
  }
  
  public function isValid()
  {
    error_log("Status: " . $this->response['status']);
    if(empty($this->response['status']))
    {
      return False;
    }
    if($this->response['status'] == 'ok')
    {
      return True;
    }
    return False;
  }
  
  public function getErrors()
  {
    return $this->response;
  }
  
  public function get_digest()
  {
    $this->call('GET');
    return $this->response;  
  }
  
  public function update_digest()
  {
    $this->call('POST');
    return $this->response;
  }
}

class SqueezolInvitationEndpoint extends SqueezolEndpoint {
  /*
    Models the digest operations
  */
  protected $url = RESOURCE_INVITATION_URL;

  public function __construct($user_token, $data) {
    parent::__construct($user_token, $data);
  }
  
  protected function prepare_data($data)
  {
    foreach ($data as $i => $value) 
    {
      if ($i == 'group_id'){
        $this->data['group_id'] = $value;
      }
      else if ($i == 'action'){
        $this->data['action'] = $value;
      }
      else if ($i == 'mailArray'){
        $this->data['mailArray'] = json_decode($value);
      }
      else if ($i == 'admin_cntrib'){
        $this->data['admin_contrib'] = $value;
      }
      else if ($i == 'participant_id'){
        $this->data['participant_id'] = $value;
      }
      else if ($i == 'fbArray'){
        $this->data['fbArray'] = $value;
      }
      else {
        $this->data[$i] = $value;
      }
    }
    $this->data['partner'] = Mage::helper('squeezol_payment')->getPartnerId();
    return;
  }
  
  public function isValid()
  {
    error_log("Status: " . $this->response['status']);
    if(empty($this->response['status']))
    {
      return False;
    }
    if($this->response['status'] == 'ok')
    {
      return True;
    }
    return False;
  }
  
  public function getErrors()
  {
    return $this->response['error'];
  }
  
  public function get_invitation()
  {
    $this->call('GET');
    return $this->response;  
  }
  
  public function update_invitation()
  {
    $this->call('POST');
    return $this->response;
  }
}


class SqueezolGetGroupsEndpoint extends SqueezolEndpoint {
  /*
    Models the digest operations
  */
  protected $url = RESOURCE_GET_GROUPS_URL;

  public function __construct($user_token, $data) {
    parent::__construct($user_token, $data);
  }
  
  
  public function isValid()
  {
    error_log("Status: " . $this->response['status']);
    if(empty($this->response['status']))
    {
      return False;
    }
    if($this->response['status'] == 'ok')
    {
      return True;
    }
    return False;
  }
  
  public function getErrors()
  {
    return $this->response;
  }
  
  public function get_groups()
  {
    $this->call('GET');
    return $this->response;  
  }
  
}
?>
