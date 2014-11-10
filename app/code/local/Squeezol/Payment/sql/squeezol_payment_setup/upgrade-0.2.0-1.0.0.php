<?php

$installer = $this;
$installer->startSetup();

$prefix = Mage::getConfig()->getTablePrefix();

$installer->run('
    DROP TABLE squeezol_groups;
    CREATE TABLE IF NOT EXISTS' . $prefix . 'squeezol_groups (
        user_id  INT NOT NULL,
        order_id INT NOT NULL,
        group_id INT,
        PRIMARY KEY (user_id, order_id)
    );
');


$installer->endSetup();

