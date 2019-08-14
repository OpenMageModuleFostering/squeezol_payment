<?php
require('Client.php');
require('GrantType/IGrantType.php');
require('GrantType/AuthorizationCode.php');
require('../config.php');

$_ses = Mage::getSingleton('squeezol_payment/session');
$token = $_ses->getSqueezolToken();
if (empty($token)) {
  session_start();
  $client = new OAuth2\Client(SQUEEZOL_ID, SQUEEZOL_SECRET);
  if (!isset($_GET['code']))
  {
      $extra_parameters = array('scope' => SCOPE );
      $auth_url = $client->getAuthenticationUrl(AUTHORIZATION_URL, CALLBACK_URL, $extra_parameters);
      die(var_dump($auth_url));
      header('Location: ' . $auth_url);
      die('Redirect');
  }
  else
  {
      $params = array('code' => $_GET['code'], 'redirect_uri' => CALLBACK_URL);
      $response = $client->getAccessToken(ACCESS_TOKEN_URL, 'authorization_code', $params);
      $info = $response['result'];
      $client->setAccessToken($info['access_token']);
      $_ses->setSqueezolToken() = $info['access_token'];
      $_ses->setExpirationTime() = $_SERVER['REQUEST_TIME'] + $info['expires_in'];
      $_ses->setRefreshToken() = $info['refresh_token'];
      header('Location: ' . SQUEEZOL_PAY_PAGE);
      error_log('Access token' . $_ses->getSqueezolToken());
  }
}
else
  header('Location: ' . SQUEEZOL_PAY_PAGE);
?>
