<?php

$installer = $this;
$installer->startSetup();

$installer->run('
    CREATE TABLE IF NOT EXISTS squeezol_groups (
        user_id  INT NOT NULL,
        order_id INT NOT NULL,
        group_id INT,
        PRIMARY KEY (user_id, order_id)
    );
');


$installer->endSetup();
