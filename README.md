<h1>Squeezol Payments, plugin Magento</h1>
<ol>
  <li> Extract Squeezol Magento Plugin </li>
  <li> Copy the entire plugin content in your Magento root directory cp -r DirectorySqueezolModule/* /var/www/magentoRoot/ </li>

  <li> Go to https://sandbox.squeezol.com/api/partner/join and follow the procedure in
        order to create your test partner account and get your Application ID e Application
        Secret KEY. The Web site URL e.g. www.yourmagentoshop.com Callback URL e.g.
        www.yourmagentoshop.com/squeezol/index/oauth
  </li>
  <li> Configure Squeezol plugin in Magento Admin section: admin-system-configurations-payment
        methods. Set Application ID e Application Secret KEY and enable sandbox.</li>
  <li> Done </li>
</ol>
<h1> Go to production </h1>
<ol>
  <li>Go to the magento Admin section admin-system-configurations-payment methods: dis-
       able sandbox and replace Application ID e Application Secret KEY to the production ones (obtained on www.squeezol.com).
  </li>
  <li> Go to https://www.squeezol.com/api/partner/join and follow the procedure in order to create your test partner account and get your Application ID e Application Secret KEY. The Web site URL e.g. www.yourmagentoshop.com Callback URL e.g. www.yourmagentoshop.com/index.php/squeezol/index/oauth
  </li>
  <li> Configure Squeezol plugin in Magento Admin section: admin-system-configurations-payment methods. Set Application ID e Application Secret KEY
  </li>
  <li>
  Wait for Squeezol staff approval
  </li>
</ol>