<?php

$installer = $this;

$installer->startSetup();
$tableName = $installer->getTable('squeezol_payment/params');

if ($installer->getConnection()->isTableExists($tableName) != true) {
    $table = $installer->getConnection()
                       ->newTable($tableName)
                       ->addColumn('param_id', Varien_Db_Ddl_Table::TYPE_INTEGER, null, array('primary' => true, 'identity' => true), 'Param Id')
                       ->addColumn('param_key', Varien_Db_Ddl_Table::TYPE_TEXT, 255, array(), 'Param Key')
                       ->addColumn('param_val', Varien_Db_Ddl_Table::TYPE_TEXT, 255, array(), 'Param Value');

    $installer->getConnection()->createTable($table);
}

$installer->endSetup();
