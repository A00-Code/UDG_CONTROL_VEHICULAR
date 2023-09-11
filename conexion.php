<?php
//use function PHPSTORM_META\type;

$DEF_HOST = "localhost";
$DEF_DB = "id21247169_udg_cvehicular";
$DEF_USER = "id21247169_udg_admin";
$DEF_PASSWORD = "UDG_Salud_App1";

$DEF_ADMIN_KEY= "UDGDATABASE";

if (isset($_FILES['xfile'])) {
   $RAW = $_POST['JSON'];
} else {
   header("Content-Type: application/json; charset=UTF-8");
   $RAW = file_get_contents("php://input");
}

//! #####  Variables Generales ##### ///
$RAW2 = json_decode($RAW, true);

$PHP_Function = $RAW2["EXECUTE"];
$DB_JSON =  $RAW2["JSON"];

if ($DB_JSON == "ERROR") {
   $DB_DATA = "ERROR";
} else {
   $DB_DATA = json_decode($DB_JSON, true);
}

if($DEF_HOST != ""){$_DB_HOST = $DEF_HOST;}
else {$_DB_HOST = $DB_DATA["DB_HOST"];}
if($DEF_DB != ""){$DB_DB = $DEF_DB;}
else {$DB_DB = $DB_DATA["DB_NAME"];}
if($DEF_USER != ""){$_DB_USER = $DEF_USER;}
else {$_DB_USER = $DB_DATA["DB_USER"];}
if($DEF_PASSWORD != ""){$_DB_PASSWORD = $DEF_PASSWORD;}
else {$_DB_PASSWORD = $DB_DATA["DB_PASSWORD"];}

try {
   $_DB_CONEXION = new PDO("mysql:host=$_DB_HOST;dbname={$DB_DB}", $_DB_USER, $_DB_PASSWORD);
   $_DB_CONEXION->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
   echo "ERROR";
   $_DB_CONEXION = null;
}

// >>> Identificador de Funciones
Diferenciador($PHP_Function, $DB_DATA, $_DB_CONEXION);

function Diferenciador($PHP_Function, $DB_DATA, $_DB_CONEXION){
   // Normal-User Functions
   if($PHP_Function == "USER_LOGIN")   { LOGIN($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "NEW_USER"  )   { INSERT_DATA($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "TRY_ADD_USER") { TRY_ADD_USER($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "NEW_VEHICLE")  { INSERT_DATA($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "NEW_CONTROL")  { INSERT_DATA($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "SEND_REPORT")  { INSERT_DATA($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "GET_USER_DATA"){ SELECT_DATA($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "GET_HISTORY")  { SELECT_DATA($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "VEHICLES_LIST"){ SELECT_DATA($DB_DATA, $_DB_CONEXION);}
   if($PHP_Function == "FORGOTED_USER"){ FORGOTED_USER($DB_DATA, $_DB_CONEXION);}
   
   if($PHP_Function == "ACCEPT_USER"){ INSERT_DATA($DB_DATA,$_DB_CONEXION);}
} 

//! ##### FUNCIONES DEV ##### ///

//! ##### FUNCIONES ESPECIFICAS ##### ///
// >>> Iniciar Sesion
function LOGIN($DB_DATA, $_DB_CONEXION)
{
   if ($DB_DATA == "ERROR") {
      echo json_encode(array("RESULT" => "ERROR"));
      return "ERROR";
   } else {
      $SQL = 'SELECT ' . $DB_DATA['KEYS'] . ' FROM ' . $DB_DATA['DB_TABLE1'] . ' WHERE ' . $DB_DATA["WHERE"] . " LIMIT 1";
      
      $stmt = $_DB_CONEXION->prepare($SQL);
      $stmt->execute();
      $Result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      try {
         if (count($Result) > 0) {
            if ($Result[0]["ID"] == $DB_DATA["USER_ID"]) {
               if ($Result[0]["USER_PASSWORD"] == $DB_DATA["USER_PASSWORD"]) {
                  $SQL = 'SELECT ' . $DB_DATA['KEYS'] . ' FROM ' . $DB_DATA['DB_TABLE2'] . ' WHERE ' . $DB_DATA["WHERE"] . " LIMIT 1";
                  $stmt = $_DB_CONEXION->prepare($SQL);
                  $stmt->execute();
                  $Result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                  $SQL = 'SELECT ' . $DB_DATA['KEYS'] . ' FROM ' . $DB_DATA['DB_TABLE3'] . " WHERE ID='{$Result[0]['VEHICULO']}' LIMIT 1";
                  $stmt = $_DB_CONEXION->prepare($SQL);
                  $stmt->execute();
                  $Result2 = $stmt->fetchAll(PDO::FETCH_ASSOC);

                  if(count($Result) > 0){
                     $Result = $Result[0];
                  } else {
                     $Result = "";
                  }
                  if(count($Result2) > 0){
                     $Result2 = $Result2[0];
                  } else {
                     $Result2 = "";
                  }
                  
                  echo json_encode(array("RESULT" => "SUCCESS", "LOGING" => "TRUE", $Result, $Result2));
                  return "SUCCESS";
               } else {
                  echo json_encode(array("RESULT" => "SUCCESS", "LOGING" => "FALSE", $Result));
                  return "SUCCESS";
               }
            } else {
               echo json_encode(array("RESULT" => "SUCCESS", "LOGING" => "FALSE", $Result));
               return "SUCCESS";
            }
         } else {
            echo json_encode(array("RESULT" => "SUCCESS", "LOGING" => "FALSE", $Result));
            return "SUCCESS";
         }
      } catch (PDOException $e) {
         echo json_encode(array("RESULT" => "ERROR"));
         return "ERROR";
      }
   }
}

function INSERT_DATA($DB_DATA, $_DB_CONEXION)
{
   global $DEF_ADMIN_KEY;
   if ($DB_DATA == "ERROR") {
      echo json_encode(array("RESULT" => "ERROR"));
      return "ERROR";
   } else {
      $DB_DATA["WHERE"] = (isset($DB_DATA["WHERE"])) ? $DB_DATA["WHERE"]:"";
      if ($DB_DATA["WHERE"] != "") {
         $SQL = "UPDATE {$DB_DATA["DB_TABLE"]} SET {$DB_DATA["SET"]} WHERE {$DB_DATA["WHERE"]}";
      } else {
         $SQL = "INSERT INTO " . $DB_DATA["DB_TABLE"] . " " . $DB_DATA["KEYS"] . " VALUES (" . $DB_DATA["VALUES"] . ");";
      } 
      if(isset($DB_DATA['DEV_KEY'])){
         if($DB_DATA['DEV_KEY'] != $DEF_ADMIN_KEY){ 
            echo json_encode(array("RESULT" => "ERROR", "CLAVE_INCORRECTA"));
            return "ERROR"; 
         }
      }
      try {
         $stmt = $_DB_CONEXION->prepare($SQL);
         $stmt->execute();
         echo json_encode(array("RESULT" => "SUCCESS"));
         return "SUCCESS";
      } catch (PDOException $e) {
         echo json_encode(array("RESULT" => "ERROR", $e, $DB_DATA, $SQL));
         return "ERROR";
      }
   }
}

function SELECT_DATA($DB_DATA, $_DB_CONEXION)
{
   if ($DB_DATA == "ERROR") {
      echo json_encode(array("RESULT" => "ERROR"));
      return "ERROR";
   } else {
      $DB_DATA['ORDER'] = (isset($DB_DATA['ORDER'])) ? $DB_DATA['ORDER']:"";

      if($DB_DATA['ORDER'] != ""){
            $SQL = "SELECT * FROM " . $DB_DATA["DB_TABLE"] . " WHERE " . $DB_DATA["WHERE"] . " " . $DB_DATA["ORDER"] . " " . $DB_DATA["LIMIT"];
      } else {
        $SQL = "SELECT * FROM " . $DB_DATA["DB_TABLE"] . " WHERE " . $DB_DATA["WHERE"] . " " . $DB_DATA["LIMIT"];
      }

      $stmt = $_DB_CONEXION->prepare($SQL);
      $stmt->execute();
      try {
         $Result = $stmt->fetchAll(PDO::FETCH_ASSOC);
         if (count($Result) > 0) {
            echo json_encode(array("RESULT" => "SUCCESS", $Result));
            return "SUCCESS";
         } else {
            echo json_encode(array("RESULT" => "SUCCESS", "", ""));
            return "SUCCESS";
         }
      } catch (PDOException $e) {
         echo json_encode(array("RESULT" => "ERROR", $e));
         return "ERROR";
      }
   }
}

function TRY_ADD_USER($DB_DATA, $_DB_CONEXION)
{
   if ($DB_DATA == "ERROR") {
      echo json_encode(array("RESULT" => "ERROR"));
      return "ERROR";
   } else {
      $DB_DATA['ORDER'] = (isset($DB_DATA['ORDER'])) ? $DB_DATA['ORDER']:"";

      if($DB_DATA['ORDER'] != ""){
            $SQL = "SELECT * FROM " . $DB_DATA["DB_TABLE"] . " WHERE " . $DB_DATA["WHERE"] . " " . $DB_DATA["ORDER"] . " LIMIT 1";
      } else {
        $SQL = "SELECT * FROM " . $DB_DATA["DB_TABLE"] . " WHERE " . $DB_DATA["WHERE"] . " LIMIT 1";
      }

      $stmt = $_DB_CONEXION->prepare($SQL);
      $stmt->execute();
      try {
      $Result = $stmt->fetchAll(PDO::FETCH_ASSOC);
      if (count($Result) == 0) {

         $SQL = "INSERT INTO {$DB_DATA['DB_TABLE']} {$DB_DATA['KEYS']} VALUES ({$DB_DATA['VALUES']})";
         $stmt = $_DB_CONEXION->prepare($SQL);
         $stmt->execute();

         echo json_encode(array("RESULT" => "SUCCESS"));
         return "SUCCESS";
      } else {
         echo json_encode(array("RESULT" => "SUCCESS"));
         return "SUCCESS";
      }
      } catch (PDOException $e) {
         echo json_encode(array("RESULT" => "ERROR", $e));
         return "ERROR";
      }
   }
}

function FORGOTED_USER($DB_DATA, $_DB_CONEXION)
{
   echo json_encode(array("RESULT"=>"SUCCES"));
}

function ACEPT_REGISTER($DB_DATA, $_DB_CONEXION)
{
   if ($DB_DATA == "ERROR"){ echo json_encode(array("RESULT"=>"ERROR")); return "ERROR";}
   else { 
      $SQL = "SELECT * FROM registros WHERE ID = " . $DB_DATA['VALUES'] . ";";
      $stmt = $_DB_CONEXION->prepare($SQL);
      $stmt->execute();
      try{
         $Result = $stmt->fetchAll(PDO::FETCH_ASSOC);
         if(count($Result) > 0){
            $SQL = "INSERT INTO users(ID,USER_PASSWORD,CORREO) VALUES (:0, :1, :2);";
            $stmt = $_DB_CONEXION->prepare($SQL);
            $stmt->bindParam(":0", $Result[0]["ID"]);
            $stmt->bindParam(":1", $Result[0]["USER_PASSWORD"]);
            $stmt->bindParam(":2", $Result[0]["CORREO"]);
            $stmt->execute();

            $SQL = "INSERT INTO user_data(ID,NOMBRE,APELLIDO_1,APELLIDO_2,FECHA,TELEFONO,CORREO,LEVEL,ULTIMA_VEZ) VALUES (:0,:1,:2,:3,:4,:5,:6,:7,:8);";
            $stmt = $_DB_CONEXION->prepare($SQL);
            $stmt->bindParam(":0", $Result[0]["ID"]);
            $stmt->bindParam(":1", $Result[0]["NOMBRE"]);
            $stmt->bindParam(":2", $Result[0]["APELLIDO_1"]);
            $stmt->bindParam(":3", $Result[0]["APELLIDO_2"]);
            $stmt->bindParam(":4", $Result[0]["FECHA"]);
            $stmt->bindParam(":5", $Result[0]["TELEFONO"]);
            $stmt->bindParam(":6", $Result[0]["CORREO"]);
            $stmt->bindParam(":7", $Result[0]["LEVEL"]);
            $stmt->bindParam(":8", $Result[0]["ULTIMA_VEZ"]);
            $stmt->execute();

            $SQL = "INSERT INTO vehiculos(ID,PLACA,MARCA,MODELO,AÑO,COLOR,TIPO,DUEÑO) VALUES (:0,:1,:2,:3,:4,:5,:6,:7);";
            $stmt = $_DB_CONEXION->prepare($SQL);
            $stmt->bindParam(":0", $Result[0]["ID"]);
            $stmt->bindParam(":1", $Result[0]["PLACA"]);
            $stmt->bindParam(":2", $Result[0]["MARCA"]);
            $stmt->bindParam(":3", $Result[0]["MODELO"]);
            $stmt->bindParam(":4", $Result[0]["AÑO"]);
            $stmt->bindParam(":5", $Result[0]["COLOR"]);
            $stmt->bindParam(":6", $Result[0]["TIPO"]);
            $stmt->bindParam(":7", $Result[0]["ID"]);
            $stmt->execute();

            $SQL = "DELETE FROM registros WHERE ID = " . $Result[0]["ID"] . ";";
            $stmt = $_DB_CONEXION->prepare($SQL);
            $stmt->execute();

      }   
      echo json_encode(array("RESULT"=>"SUCCESS", $Result)); return "SUCCESS";
   } catch(PDOException $e) { echo json_encode(array("RESULT"=>"ERROR", $e)); return "ERROR";}
   }  
}
