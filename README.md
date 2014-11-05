# Squeezol Payments, plugin Magento
1. Extract Squeezol Magento Plugin
2. Copy the entire plugin content in your Magento root directory cp -r DirectorySqueezolModule/* /var/www/magentoRoot/
3. Go to https://sandbox.squeezol.com/api/partner/join and follow the procedure in order to create your test partner account and get your Application ID e Application Secret KEY. 
Insert:
* The Web site Url e.g. www.yourmagentoshop.com
* Callback Url e.g. www.yourmagentoshop.com/squeezol/index/oauth
* IPN Url e.g. www.yourmagentoshop.com/squeezol/index/ipn/

4. Configure Squeezol plugin in Magento Admin section: admin->system->configurations->payment
        methods. Set Application ID e Application Secret KEY and enable sandbox.
5. Go to System -> Cache Management and Flush the entire cache
6. Done
#  Go to production
1. Go to the magento Admin section admin-system-configurations-payment methods: disable sandbox and replace Application ID e Application Secret KEY to the production ones (obtained on www.squeezol.com).
2. Go to https://www.squeezol.com/api/partner/join and follow the procedure in order to create your test partner account and get your Application ID e Application Secret KEY.
Insert:
* The Web site Url e.g. www.yourmagentoshop.com
* Callback Url e.g. www.yourmagentoshop.com/squeezol/index/oauth
* IPN Url e.g. www.yourmagentoshop.com/squeezol/index/ipn/
3. Configure Squeezol plugin in Magento Admin section: admin->system->configurations->payment methods. Set Application ID e Application Secret KEY
4. Go to System -> Cache Management and Flush the entire cache
5.  Wait for Squeezol staff approval