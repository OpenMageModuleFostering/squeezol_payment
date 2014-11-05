# Squeezol Payments, plugin Magento
* Extract Squeezol Magento Plugin
* Copy the entire plugin content in your Magento root directory cp -r DirectorySqueezolModule/* /var/www/magentoRoot/
* Go to https://sandbox.squeezol.com/api/partner/join and follow the procedure in order to create your test partner account and get your **Application ID** and ** Application Secret KEY**. Insert:

1. The Web site Url e.g. http://www.yourmagentoshop.com
2. Callback Url e.g. http://www.yourmagentoshop.com/squeezol/index/oauth
3. IPN Url e.g. http://www.yourmagentoshop.com/squeezol/index/ipn/

* Configure Squeezol plugin in Magento Admin section: System->Configurations->Payment
    methods. Set **Application ID** and **Application Secret KEY** and *enable sandbox*.
* Go to System -> Cache Management and Flush the entire cache
* Done

#  Go to production
* Go to the magento Admin section System->Configurations->Payment methods: disable sandbox and replace **Application ID** and **Application Secret KEY** to the production ones (obtained on www.squeezol.com).
* Go to https://www.squeezol.com/api/partner/join and follow the procedure in order to create your test partner account and get your **Application ID** and **Application Secret KEY**. Insert:

1. The Web site Url e.g. http://www.yourmagentoshop.com
2. Callback Url e.g. http://www.yourmagentoshop.com/squeezol/index/oauth 
3. IPN Url e.g. http://www.yourmagentoshop.com/squeezol/index/ipn/

* Configure Squeezol plugin in Magento Admin section: admin->system->configurations->payment methods. Set **Application ID** e **Application Secret KEY**
* Go to System -> Cache Management and Flush the entire cache
* Wait for Squeezol staff approval

# TroubleShooting
1. Double check: every Url must have http:// or https://
2. The Callback Url should **not** have a trailing "/" 