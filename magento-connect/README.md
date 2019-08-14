# Squeezol Payments, plugin Magento
## Sandbox ##
* Estrarre il plugin magento
* Copiare l'intero contenuto nella cartella di Magento cp -r DirectorySqueezolModule/* /var/www/magentoRoot/ (o scaricarlo dal Magento store)
* Andare su https://sandbox.squeezol.com/api/partner/join e seguire la procedura per creare l'account di test e ottenere **Application ID** e ** Application Secret KEY**. Inserire:

1. L' Url del sito, ad esempio: http://www.yourmagentoshop.com
2. Callback Url, nella forma: http://www.yourmagentoshop.com/squeezol/index/oauth
3. IPN Url, nella forma: http://www.yourmagentoshop.com/squeezol/index/ipn/

* Configurare il plugin Squeezol nella sezione Admin: System->Configurations.
  Nella barra laterale cercare: ->Payment methods.
  Trovare Squeezol e impostare **Application ID** e **Application Secret KEY** e selezionare *enable sandbox*.
* Andare nella sezione System -> Cache Management ed eseguire il  Flush della cache.
* Fine.

## Andare il produzione ##
* Andare su https://www.squeezol.com/api/partner/join e seguire la procedura per creare l'account di produzione e ottenere **Application ID** and **Application Secret KEY**. Inserire:

1. L'Url del sito ad esempio: http://www.yourmagentoshop.com
2. Callback Url, nella forma: http://www.yourmagentoshop.com/squeezol/index/oauth 
3. IPN Url, nella forma: http://www.yourmagentoshop.com/squeezol/index/ipn/

* Andare nella sezione Admin: System->Configurations. Nella barra laterale cercare Squeezol: disabilitare sandbox and sostituire **Application ID** e **Application Secret KEY** con quelli di produzione (appena ottenuti su www.squeezol.com).
* Andare su -> Cache Management ed eseguire il Flush della cache.
* Aspettare l'approvazione dello staff di Squeezol.

## Risoluzione dei problemi ##
1. Controllare che tutti gli Url abbiano http:// o https://
2. The Callback Url non dovrebbe avere  "/" finale
3. Contattare support@squeezol.com

# Squeezol Payments, plugin Magento
## Sandbox ##
* Extract Squeezol Magento Plugin
* Copy the entire plugin content in your Magento root directory cp -r DirectorySqueezolModule/* /var/www/magentoRoot/
* Go to https://sandbox.squeezol.com/api/partner/join and follow the procedure in order to create your test partner account and get your **Application ID** and ** Application Secret KEY**. Insert:

1. The Web site Url e.g. http://www.yourmagentoshop.com
2. Callback Url e.g. http://www.yourmagentoshop.com/squeezol/index/oauth
3. IPN Url e.g. http://www.yourmagentoshop.com/squeezol/index/ipn/

* Configure Squeezol plugin in Magento Admin section: System->Configurations.
  In the side bar go to  Payment methods.
  Find Squeezol, set **Application ID** and **Application Secret KEY** and *enable sandbox*.
* Go to System -> Cache Management and Flush the entire cache.
* Done.

## Go to production ##
* Go to https://www.squeezol.com/api/partner/join and follow the procedure in order to create your partner account and get your **Application ID** and **Application Secret KEY**. Insert:

1. The Web site Url e.g. http://www.yourmagentoshop.com
2. Callback Url e.g. http://www.yourmagentoshop.com/squeezol/index/oauth 
3. IPN Url e.g. http://www.yourmagentoshop.com/squeezol/index/ipn/

* Go to the magento Admin section System->Configurations. In the Side bar go to Payment methods and find Squeezol: disable sandbox and replace **Application ID** and **Application Secret KEY** to the production ones (just obtained on www.squeezol.com).
* Go to System -> Cache Management and Flush the entire cache.
* Wait for Squeezol staff approval.

## TroubleShooting ##
1. Double check: every Url must have http:// or https://
2. The Callback Url should **not** have a trailing "/"
3. Contact support@squeezol.com