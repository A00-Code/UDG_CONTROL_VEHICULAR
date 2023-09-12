// ---- CODIGO JAVASCRIPT ---- ///

// Variables Globales
var WEB_DATA = {
  USUARIO_EXT: { ID: "" },
  USUARIO: {
    ID: "",
    NOMBRE: "",
    APELLIDO_1: "",
    APELLIDO_2: "",
    GENERO: "",
    FECHA: "",
    TELEFONO_1: "",
    CORREO: "",
    LEVEL: "",
    VEHICULO: "",
  },
  HISTORIAL: { TOTAL: 0 },
  VEHICLES: {},
};
var WEB_CONFIG = {
  DATABASE: {
    USER: "root",
    PASSWORD: "",
    HOST: "127.0.0.1",
    NOMBRE: "UDG_CVEHICULAR",
    TABLA: {
      LOGIN: "USERS",
      HISTORIAL: "HISTORIAL",
      USERS_DATA: "USER_DATA",
      VEHICULOS: "VEHICULOS",
      REPORTES: "REPORTES",
    },
  },
  CONEXION: { METHOD: "SERVER", MODE: null, SEGURITY: null },
  DATES: { LAST_SYNC: "", LAST_LOAD: "", LAST_SAVE: "" },
};
var WEB_USERS = {
  USERS: { BLANK: { PASSWORD: "", CORREO: "" } },
  DATA: {
    BLANK: {
      ID: "",
      NOMBRE: "",
      APELLIDO_1: "",
      APELLIDO_2: "",
      GENERO: "",
      FECHA: "",
      TELEFONO_1: "",
      CORREO: "",
      HISTORIAL: { BLANK: { FECHA: "", HORA: "", MOVIMIENTO: "" } },
    },
  },
  VEHICULOS: {
    BLANK: {
      PLACA: "",
      MARCA: "",
      MODELO: "",
      AÑO: "",
      COLOR: "",
      DETALLES: "",
      TIPO: "",
      DUEÑO: "",
    },
  },
  HISTORIAL: { TOTAL: 0 },
};
var Menus_ID = [
  "Mn_Login",
  "Mn_Registro",
  "Mn_Recuperar",
  "Mn_Principal_Student",
  "Mn_Historial_Student",
  "Mn_Info_Student",
  "Mn_Report",
  "Mn_Principalin",
  "Mn_Control",
  "Mn_Historial_Admin",
  "Mn_Info_Admin",
  "Mn_Loading",
];

//! ===== >>> [ FUNCIONES -> CONTROL]
// >>> Cambiar de Pagina
function GOTO_MENU(Page) {
  let TIME = GET_TIME();
  let Day = TIME["DATE"],
    Hora = TIME["TIME"];

  let Menu_Open = -1;
  for (let x in Menus_ID) {
    document.getElementById(Menus_ID[x]).classList.add("Hiden");
  }

  if (WEB_DATA["USUARIO"]["ID"] != "") {
    if (Page == "Principal") {
      if (WEB_DATA["USUARIO"]["LEVEL"] == "DEV") {
        Menu_Open = 7;
      } else {
        Menu_Open = 3;
      }
    }
    if (Page == "History") {
      Menu_Open = 9;
      if (WEB_DATA["USUARIO"]["LEVEL"] == "DEV") {
        Menu_Open = 9;
      } else {
        Menu_Open = 4;
      }
      History_List();
    }
    if (Page == "Info_Est") {
      Menu_Open = 5;
    }
    if (Page == "Report") {
      Menu_Open = 6;
    }
    if (Page == "Control") {
      Menu_Open = 8;
      document.querySelector(".DEV_Date").innerHTML = Day;
      document.querySelector(".DEV_Time").innerHTML = Hora.slice(0, 5);
    }
    if (Page == "Info_Adm") {
      Menu_Open = 10;
    }
  } else {
    if (Page == "Principal") {
      Page = 'Login';
    }
  }
  if (Page == "Login") {
    Menu_Open = 0;
  }
  if (Page == "Loading") {
    Menu_Open = 11;
  }
  if (Page == "Registro") {
    Menu_Open = 1;
  }
  if (Page == "Recuperar") {
    Menu_Open = 2;
  }
  document.getElementById(Menus_ID[Menu_Open]).classList.remove("Hiden");
}

//! ===== >>> [ FUNCIONES -> DEV]
// >>> Nueva Base de Datos Local

// Obtener Fecha y Hora Actual
function GET_TIME() {
  let DATE = new Date();
  let TIME = {
    DATE: "",
    TIME: "",
    DAY_ONE: 0,
    YEAR: DATE.getFullYear(),
    MOUNT: DATE.getMonth() + 1,
    DAY: DATE.getDate(),
    HOUR: DATE.getHours(),
    MINUT: DATE.getMinutes(),
    SECOND: DATE.getSeconds(),
  };

  if (TIME["MOUNT"] < 10) {
    TIME["MOUNT"] = `0${TIME["MOUNT"]}`;
  }
  if (TIME["DAY"] < 10) {
    TIME["DAY"] = `0${TIME["DAY"]}`;
  }

  if (TIME["HOUR"] < 10) {
    TIME["HOUR"] = `0${TIME["HOUR"]}`;
  }
  if (TIME["MINUT"] < 10) {
    TIME["MINUT"] = `0${TIME["MINUT"]}`;
  }
  if (TIME["SECOND"] < 10) {
    TIME["SECOND"] = `0${TIME["SECOND"]}`;
  }

  let DATE_START = new Date(TIME["YEAR"], TIME["MOUNT"] - 1, 1);
  TIME["DAY_ONE"] = DATE_START.getDay();
  TIME["TIME"] = `${TIME["HOUR"]}:${TIME["MINUT"]}:${TIME["SECOND"]}`;
  TIME["DATE"] = `${TIME["YEAR"]}-${TIME["MOUNT"]}-${TIME["DAY"]}`;
  return TIME;
}

//! ===== >>> [ FUNCIONES -> CONFIGURACION]
// >>> REMOVER -> LOCAL JSON
function REMOVE_LOCAL_JSON(Name) {
  Name = String(Name).toUpperCase();
  if (Name == "ALL" || Name == "CONFIG") {
    localStorage.removeItem("UDG_CONFIG");
  }
  if (Name == "ALL" || Name == "DATA") {
    localStorage.removeItem("UDG_DATA");
  } else {
    console.log(`'${Name}' No es una Configuracion.`);
  }
}

// >>> Cargar Configuracion DB
function LOAD_LOCAL() {
  let Config_JSON1 = localStorage.getItem("UDG_CONFIG");
  let DATA_CONFIG1 = JSON.parse(Config_JSON1);
  if (DATA_CONFIG1 != null) {
    WEB_CONFIG = DATA_CONFIG1;
  }

  if (WEB_CONFIG["CONEXION"]["METHOD"] == "LOCAL") {
    let Config_JSON2 = localStorage.getItem("UDG_DATABASE");
    let DATA_CONFIG2 = JSON.parse(Config_JSON2);
    if (DATA_CONFIG2 != null) {
      WEB_USERS = DATA_CONFIG2;
    }
  }

  if (
    WEB_CONFIG["CONEXION"]["METHOD"] == "LOCAL" ||
    WEB_CONFIG["CONEXION"]["SEGURITY"] != "REALTIME"
  ) {
    let Data_JSON3 = localStorage.getItem("UDG_DATA");
    let DATA_DATA3 = JSON.parse(Data_JSON3);
    if (DATA_DATA3 != null) {
      WEB_DATA = DATA_DATA3;
    }
  }

  let TIME = GET_TIME();
  WEB_CONFIG["DATES"]["LAST_LOAD"] = TIME["DATE"];

  return true;
}

function SAVE_LOCAL_ALL() {
  let TIME = GET_TIME();
  WEB_CONFIG["DATES"]["LAST_SAVE"] = TIME["DATE"];

  if (
    WEB_CONFIG["CONEXION"]["METHOD"] == "LOCAL" ||
    WEB_CONFIG["CONEXION"]["MODE"] != "REALTIME"
  ) {
    localStorage.setItem("UDG_DATABASE", JSON.stringify(WEB_USERS));
  }
  localStorage.setItem("UDG_CONFIG", JSON.stringify(WEB_CONFIG));
  localStorage.setItem("UDG_HISTORY", JSON.stringify(WEB_DATA));
}

//! ===== >>> [ FUNCIONES -> ALMACENAMIENTO -> CACHE]
// >>> Agregar Elementos al Alamacenamiento Local

//! ===== >>> [ FUNCIONES -> ALMACENAMIENTO -> BASE DE DATOS]
// >>> Enviar Comando a PHP
function SEND_TO_PHP(Funcion, Data) {
  Data["DB_HOST"] = WEB_CONFIG["DATABASE"]["HOST"];
  Data["DB_USER"] = WEB_CONFIG["DATABASE"]["USER"];
  Data["DB_PASSWORD"] = WEB_CONFIG["DATABASE"]["PASSWORD"];
  Data["DB_NAME"] = WEB_CONFIG["DATABASE"]["NOMBRE"];

  let Send = { EXECUTE: Funcion, JSON: JSON.stringify(Data) };

  fetch("./conexion.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Send),
  })
    .then((Res) => {
      return Res.text();
    })
    .then((XRes) => {
      return JSON.parse(XRes);
    })
    .then((JRes) => {
      if (Funcion == "USER_LOGIN") {
        if (JRes[0] != "") {
          WEB_DATA["USUARIO"] = JRes[0];
          WEB_DATA['VEHICLES'] = JRes[1];
        }
      } else if (Funcion == "GET_USER_DATA") {
        if (JRes[0] != "") {
          WEB_DATA["USUARIO_EXT"] = {...WEB_DATA["USUARIO_EXT"], ...JRes[0][0]};
        }
      } else if (Funcion == "GET_USER_DATA2") {
        if (JRes[0] != "") {
          WEB_DATA["USUARIO_EXT"] = {...WEB_DATA["USUARIO_EXT"], ...JRes[0]};
        }
      } else if (Funcion == "GET_HISTORY") {
        if (JRes[0] != "") {
          WEB_DATA["HISTORIAL"] = JRes[0];
          WEB_DATA["HISTORIAL"]["TOTAL"] = Object.keys(JRes[0]).length;
        }
      } else if (Funcion == "VEHICLES_LIST") {
        if (JRes[0] != "") {
          let XX = Object.keys(JRes[0]).length;
          for(let x=0;x<XX;x++){
            WEB_DATA["VEHICLES"][JRes[0][x]['ID']] = JRes[0][x];
          }
          WEB_DATA["VEHICLES"]["TOTAL"] = XX;

        }
      }
    })
    .catch((Err) => {
      console.error(Err);
      return "ERROR";
    });
}

//! ===== >>> [ FUNCIONES -> ESPECIFICAS]
function APP_ALERT(Menu, N_Alet) {
  Menu = String(Menu).toUpperCase();
  let APP_ALERT = document.getElementById("APP_Alert");
  if (Menu == 0) {
    APP_ALERT.classList.add("Hiden");
    return null;
  } else {
    APP_ALERT.classList.remove("Hiden");
  }

  let Alert_Icon = {
    CALENDAR: "IMG/Calendar.svg",
    CALENDAR_ALERT: "IMG/Calendar_Alert.svg",
    COMPUTER: "IMG/Computer.svg",
    CONFIG: "IMG/Config.svg",
    DATA_TRANSFER: "IMG/Data_Transfer.svg",
    HELP: "IMG/Help.svg",
    HISTORY: "IMG/History.svg",
    INFO: "IMG/Info.svg",
    ERROR: "IMG/No_select.svg",
    RESICLE: "IMG/Resicle.svg",
    DELETE: "IMG/Delete.svg",
    SHIELD_ALERT: "IMG/Shield_Alert.svg",
    UPDATE: "IMG/Update.svg",
    USER_NONE: "IMG/User_None.svg",
    USER_WAIT: "IMG/User_Time.svg",
    WIFI_CLOUD: "IMG/Wifi_Cloud.svg",
    WIFI_NO: "IMG/Wifi_No.svg",
  };
  let Alert_Message = {
    LOGIN: {
      0: {
        Icon: Alert_Icon["USER_NONE"],
        Title: "Usuario no encontrado",
        Text: "El usuario no esta registrado.",
      },
      1: {
        Icon: Alert_Icon["USER_NONE"],
        Title: "Usuario o Contraseña incorrecto/a",
        Text: "El usuario o la contraseña no es correcto/a.",
      },
      2: {
        Icon: Alert_Icon["USER_NONE"],
        Title: "Usuario sin validar",
        Text: "El usuario existe en el sistmema pero aun no ha sido validado, por favor espere a que un adiministrativo valide su registro.",
      },
    },
    INFO: {
      0: { Icon: "", Title: "", Text: "" },
    },
    ALERT: {
      0: { Icon: "", Title: "", Text: "" },
    },
    ERROR: {
      0: {
        Icon: Alert_Icon["ERROR"],
        Title: "ERROR - CONFIGURACION VACIA",
        Text: "No se a detectado una configuracion valida. Que accion desea realizar?.",
      },
      1: {
        Icon: Alert_Icon["ERROR"],
        Title: "ERROR - BASE DE DATOS NO ENCONTRADA",
        Text: "No se ha podido establecer conexion con la base de datos, porfavor compuebe su conexion a internet y reinicie la pagina.\nSi el error persiste notifique al personal.",
      },
      2: {
        Icon: Alert_Icon["ERROR"],
        Title: "ERROR - RESPUESTA INCORRECTA",
        Text: "Se ha obtenido una respuesta incorrcta desde la Base de datos, porfavor reintente esta operacion nuevamente.",
      },
    },
    REGISTRO: {
      0: {
        Icon: Alert_Icon["USER_NONE"],
        Title: "Error de registro",
        Text: "Ha ocurrido un error durante el registro, porfavor vuelva a intentarlo mas tarde.",
      },
      1: {
        Icon: Alert_Icon["USER_WAIT"],
        Title: "Solicitud enviada",
        Text: "La solicitud de registro ha sido enviada para ser procesada manualmente, esto puede tardar varias horas, se le enviara un correo electronico una vez el proceso haya finalizado.",
      },
    },
  };

  try {
    let New_Icon = document.createElement("img");
    if (Alert_Message[Menu][N_Alet]["Icon"] != null) {
      New_Icon.src = Alert_Message[Menu][N_Alet]["Icon"];
    } else {
      New_Icon.src = Alert_Icon["ERROR"];
    }
    APP_ALERT.querySelector("img").replaceWith(New_Icon);
  } catch {
    let New_Icon = document.createElement("img");
    New_Icon.src = Alert_Icon["ERROR"];
    APP_ALERT.querySelector("img").replaceWith(New_Icon);
  }

  let Alert_Title = APP_ALERT.querySelector("#Alert_TITLE");
  try {
    if (Alert_Message[Menu][N_Alet]["Title"] != null) {
      Alert_Title.innerHTML = String(
        Alert_Message[Menu][N_Alet]["Title"]
      ).toUpperCase();
    } else {
      Alert_Title.innerHTML = "";
    }
  } catch {}

  let Alert_Text = APP_ALERT.querySelector("#Alert_TEXT");
  try {
    Alert_Text.innerHTML = Alert_Message[Menu][N_Alet]["Text"];
    if (Alert_Message[Menu][N_Alet]["Text"] == null) {
      Alert_Text.innerHTML = `#ERROR - Mensaje no encontrado [ ${Menu} => ${N_Alet} ]`;
    }
  } catch {
    Alert_Text.innerHTML = `#ERROR - Mensaje no encontrado [ ${Menu} => ${N_Alet} ]`;
  }

  let Alert_Buttons =
    APP_ALERT.querySelector(".Alert_Buttons").querySelectorAll("button");
  for (let x = 0; x < 5; x++) {
    Alert_Buttons[x].setAttribute("class", "Hiden");
  }

  let Btn_Show = 0;
  let Btn_Text = [];
  let Btn_Sty = [];
  let Btn_Actions = [];

  if (Menu == "ERROR") {
    if (N_Alet == 2) {
      Btn_Show = 1;
      Btn_Text = ["De Acuerdo"];
      Btn_Sty = [2];
      Btn_Actions = ["APP_ALERT(0,0)"];
    }
  }
  if (Menu == "LOGIN") {
    if (N_Alet == 0) {
      Btn_Show = 1;
      Btn_Text = ["De Acuerdo"];
      Btn_Sty = [2];
      Btn_Actions = ["APP_ALERT(0,0)"];
    }
    if (N_Alet == 1) {
      Btn_Show = 1;
      Btn_Text = ["De Acuerdo"];
      Btn_Sty = [2];
      Btn_Actions = ["APP_ALERT(0,0)"];
    }
    if (N_Alet == 2) {
      Btn_Show = 1;
      Btn_Text = ["De Acuerdo"];
      Btn_Sty = [2];
      Btn_Actions = ["APP_ALERT(0,0)"];
    }
  } else if (Menu == "REGISTRO") {
    if (N_Alet == 0) {
      Btn_Show = 1;
      Btn_Text = ["De Acuerdo"];
      Btn_Sty = [2];
      Btn_Actions = ["APP_ALERT(0,0)"];
    }
    if (N_Alet == 1) {
      Btn_Show = 1;
      Btn_Text = ["De Acuerdo"];
      Btn_Sty = [2];
      Btn_Actions = ["APP_ALERT(0,0)"];
    }
  }
  setTimeout(() => {
    for (let x = 0; x < Btn_Show; x++) {
      Alert_Buttons[x].classList.remove("Hiden");
      Alert_Buttons[x].innerText = Btn_Text[x];
      Alert_Buttons[x].classList.add(`Btn_Sty_${Btn_Sty[x]}`);
      Alert_Buttons[x].setAttribute("onclick", Btn_Actions[x]);
    }
  }, 50);
}

// >>> Iniciar Sesion (User)
function User_Login(Local = null) {
  let USER = document.querySelector("#LOGIN_USER");
  let PASSWORD = document.querySelector("#LOGIN_PASSWORD");

  let Loading_Bar = document.getElementById("Loading_Bar");
  let Loading_Text = document.getElementById("Loading_Text");
  document.getElementById("APP_Alert").classList.add("Hiden");

  if (Local == "LOCAL") {
    GOTO_MENU("Loading");
    WEB_CONFIG["CONEXION"] = {
      METHOD: "LOCAL",
      MODE: "LOCAL",
      SEGURITY: false,
    };

    if (LOAD_LOCAL() == true) {
      setTimeout(() => {
        let ADD = { ID: "0000", NOMBRE: "LOCAL", LEVEL: "DEV" };
        let KEYS = Object.keys(ADD);
        KEYS.forEach((Xtem) => {
          WEB_DATA["USUARIO"][Xtem] = ADD[Xtem];
        });
        GOTO_MENU("Principal");
      }, 500);
    }
    return true;
  } else {
    if (USER.value != "" && PASSWORD.value != "") {
      if (WEB_CONFIG["CONEXION"]["METHOD"] == "LOCAL") {
        GOTO_MENU("Loading");
        if (String(USER.value) in WEB_USERS["USERS"]) {
          if (
            WEB_USERS["USERS"][String(USER.value)]["PASSWORD"] ==
            String(PASSWORD.value)
          ) {
            WEB_DATA["USUARIO"] = WEB_USERS["DATA"][String(USER.value)];
            USER.classList.remove("ERROR");
            PASSWORD.classList.remove("ERROR");
            GOTO_MENU("Principal");
          } else {
            USER.classList.add("ERROR");
            PASSWORD.classList.add("ERROR");
            APP_ALERT("LOGIN", 1);
          }
        } else {
          USER.classList.add("ERROR");
          PASSWORD.classList.add("ERROR");
          APP_ALERT("LOGIN", 0);
        }
      } else if (WEB_CONFIG["CONEXION"]["METHOD"] == "SERVER") {
        let SEND = {
          DB_TABLE1: WEB_CONFIG["DATABASE"]["TABLA"]["LOGIN"],
          DB_TABLE2: WEB_CONFIG["DATABASE"]["TABLA"]["USERS_DATA"],
          DB_TABLE3: WEB_CONFIG["DATABASE"]["TABLA"]["VEHICULOS"],
          KEYS: "*",
          WHERE: `ID='${USER.value}'`,
          USER_ID: String(USER.value).toUpperCase(),
          LIMIT: 1,
          USER_PASSWORD: String(PASSWORD.value),
        };
        SEND_TO_PHP("USER_LOGIN", SEND);

        GOTO_MENU("Loading");
        let RES_COUNT = 30;
        let RESICLE = setInterval(() => {
          if( WEB_DATA["USUARIO"]?.["ID"] != ""){
            clearInterval(RESICLE);
            if (WEB_DATA["USUARIO"]?.["ID"] == String(USER.value)) {
              USER.classList.remove("ERROR");
              PASSWORD.classList.remove("ERROR");
              if(WEB_DATA["USUARIO"]["ULTIMA_VEZ"] != "POR_REGISTRAR"){
                setTimeout(() => {
                  GOTO_MENU("Principal");
                }, 100);
              } else {
                setTimeout(() => {
                  GOTO_MENU("Login");
                  APP_ALERT("LOGIN", 2);
                }, 100);
              }
            } else {
              USER.classList.add("ERROR");
              PASSWORD.classList.add("ERROR");
              GOTO_MENU("Login");
              APP_ALERT("LOGIN", 1);
            }
          }

          if(RES_COUNT < 0){
            clearInterval(RESICLE);
            GOTO_MENU("Login");
          }
          RES_COUNT -= 1;
        }, 200);
      }
    }
  }
}

function End_Sesion() {
  GOTO_MENU("Loading");
  WEB_DATA["USUARIO"] = {
    ID: "",
    NOMBRE: "",
    APELLIDO_1: "",
    APELLIDO_2: "",
    GENERO: "",
    FECHA: "",
    TELEFONO_1: "",
    CORREO: "",
    LEVEL: "",
    VEHICULO: "",
  };
  WEB_DATA["USUARIO_EXT"] = {
    ID: "",
    NOMBRE: "",
    APELLIDO_1: "",
    APELLIDO_2: "",
    GENERO: "",
    FECHA: "",
    TELEFONO_1: "",
    CORREO: "",
    LEVEL: "",
    VEHICULO: "",
  };
  if (WEB_CONFIG["CONEXION"]["METHOD"] == "LOCAL") {
    SAVE_LOCAL_ALL();
    setTimeout(() => {
      GOTO_MENU("Login");
    }, 750);
  } else {
    setTimeout(() => {
      GOTO_MENU("Login");
    }, 250);
  }
}

function Info_Menu(ID = null) {
  WEB_DATA["USUARIO_EXT"] = {};
  if(ID == null){
    ID = WEB_DATA['USUARIO']['ID'];
  }
 
  GOTO_MENU("Loading");

  let DOM = document.querySelector(".Cn_Info_Student");
  let I_PAPEL = DOM.querySelector('p[id="INFO_LEVEL"]');
  let I_NOMBRE = DOM.querySelector('p[id="INFO_NAME"]');
  let I_FECHA = DOM.querySelector('p[id="INFO_DATE"]');
  let I_CORREO = DOM.querySelector('p[id="INFO_EMAIL"]');
  let I_TEL = DOM.querySelector('p[id="INFO_TEL"]');

  let I_TIPO = DOM.querySelector('p[id="INFO_V_TYPE"]');
  let I_MARCA = DOM.querySelector('p[id="INFO_V_MARK"]');
  let I_MODELO = DOM.querySelector('p[id="INFO_V_MODEL"]');
  let I_AÑO = DOM.querySelector('p[id="INFO_V_YEAR"]');
  let I_COLOR = DOM.querySelector('p[id="INFO_V_COLOR"]');
  let I_PLACAS = DOM.querySelector('p[id="INFO_V_PLATES"]');

  let DATA = {};

  if (WEB_CONFIG["CONEXION"]["METHOD"] != "LOCAL" && ID != null) {
    let WHERE = `ID='${String(ID)}'`;
    let SEND = {
      DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["USERS_DATA"],
      KEYS: "*",
      WHERE: WHERE,
      LIMIT: 'LIMIT 1',
    };
    SEND_TO_PHP("GET_USER_DATA", SEND);
  }

  if (ID == null) {
    if (WEB_CONFIG["CONEXION"]["METHOD"] == "LOCAL") {
      try {
        WEB_DATA["USUARIO_EXT"] = {
          ...WEB_DATA["USUARIO"],
          ...WEB_USERS["VEHICULOS"][WEB_DATA["USUARIO"]["VEHICULO"]],
        };
      } catch {}
    }else {
      WEB_DATA["USUARIO_EXT"] = {
        ...WEB_DATA["USUARIO"],
        ...WEB_USERS["VEHICULOS"][WEB_DATA['USUARIO']['VEHICULO']],
      };
    }
  } else {
    setTimeout(() => {
      WEB_DATA["USUARIO_EXT"] = WEB_DATA["USUARIO_EXT"];
      WEB_DATA['USUARIO_EXT']['IMG1'] = WEB_DATA["USUARIO_EXT"]['IMG']
      
      WHERE = `DUEÑO='${String(ID)}'`;
      SEND = {
        DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]['VEHICULOS'],
        KEYS: "*",
        WHERE: WHERE,
        LIMIT: 'LIMIT 1',
      };
      SEND_TO_PHP("GET_USER_DATA", SEND);
      
      setTimeout(() => {
        WEB_DATA['USUARIO_EXT']['IMG2'] = WEB_DATA['USUARIO_EXT']['IMG']
      }, 400);


      if(ID == WEB_DATA['USUARIO']['ID']){
        document.querySelector('#Mn_Info_Student > div > div:nth-child(12)').classList.remove("Hiden");
      } else {
        document.querySelector('#Mn_Info_Student > div > div:nth-child(12)').classList.add("Hiden");
      }
    }, 400)

  }
  
  setTimeout(() => {
    let RES_COUNT = 28;
    let RESPONSE = setInterval(() => {
      if (WEB_DATA["USUARIO_EXT"]?.["ID"] != undefined && WEB_DATA['USUARIO_EXT']?.['IMG2'] != undefined) {
        clearInterval(RESPONSE);
  
        let X1 = WEB_DATA["USUARIO_EXT"]?.["NOMBRE"] ?? "";
        let X2 = WEB_DATA["USUARIO_EXT"]?.["APELLIDO_1"] ?? "";
        let X3 = WEB_DATA["USUARIO_EXT"]?.["APELLIDO_2"] ?? "";
  
        let IMG1 = document.querySelector('#Info_IMG_Person') 
        let IMG2 = document.querySelector('#Info_IMG_Car') 
  
        I_PAPEL.textContent = WEB_DATA["USUARIO_EXT"]?.["LEVEL"] ?? "";
        I_NOMBRE.textContent = `${X1} ${X2} ${X3}`;
        I_FECHA.textContent = WEB_DATA["USUARIO_EXT"]?.["FECHA"] ?? "";
        I_CORREO.textContent = WEB_DATA["USUARIO_EXT"]?.["CORREO"] ?? "";
        I_TEL.textContent = WEB_DATA["USUARIO_EXT"]?.["TELEFONO"] ?? "";
        I_TIPO.textContent = WEB_DATA["USUARIO_EXT"]?.["TIPO"] ?? "";
        I_MARCA.textContent = WEB_DATA["USUARIO_EXT"]?.["MARCA"] ?? "";
        I_MODELO.textContent = WEB_DATA["USUARIO_EXT"]?.["MODELO"] ?? "";
        I_AÑO.textContent = WEB_DATA["USUARIO_EXT"]?.["AÑO"] ?? "";
        I_COLOR.textContent = WEB_DATA["USUARIO_EXT"]?.["COLOR"] ?? "";
        I_PLACAS.textContent = WEB_DATA["USUARIO_EXT"]?.["PLACA"] ?? "";
  
        IMG1.setAttribute('src', WEB_DATA['USUARIO_EXT']['IMG1']) 
        IMG2.setAttribute('src', WEB_DATA['USUARIO_EXT']['IMG2']) 
  
        GOTO_MENU("Info_Est");
      }
  
      if (RES_COUNT < 0) {
        clearInterval(RESPONSE);
        APP_ALERT("ERROR", 2);
      }
      RES_COUNT -= 1;
    }, 200);
  }, 500);
}

function Add_Control_Register() {
  let TIME = GET_TIME();
  let T_MOV = document.querySelector(
    '.Cn_Control input[name="Control"]:checked'
  ).value;
  let PLATE = String(
    document.querySelector(".Cn_Control #Control_Plates").value
  ).toUpperCase();
  if (PLATE.length < 2) {
    return false;
  }
  let DATA = {
    FECHA: TIME["DATE"],
    HORA: TIME["TIME"],
    MOVIMIENTO: T_MOV,
    ID: PLATE,
  };

  if (WEB_CONFIG["CONEXION"]["METHOD"] != "LOCAL") {
    let KEYS = "(FECHA, HORA, MOVIMIENTO, ID, ID_ADMIN)";
    let VALUES = `'${TIME["DATE"]}', '${TIME["TIME"]}', '${T_MOV}', '${PLATE}', '${WEB_DATA["USUARIO"]["ID"]}'`;

    let SEND = {
      DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["HISTORIAL"],
      WHERE: "",
      KEYS: KEYS,
      VALUES: VALUES,
    };
    SEND_TO_PHP("NEW_CONTROL", SEND);
  }

  let DUEÑO =
    WEB_DATA["VEHICLES"]?.[PLATE]?.["ID"] != undefined
      ? WEB_DATA["VEHICLES"][PLATE]["ID"]
      : "";
  let MARCA =
    WEB_DATA["VEHICLES"]?.[PLATE]?.["MARCA"] != undefined
      ? WEB_DATA["VEHICLES"][PLATE]["MARCA"]
      : "";

  WEB_DATA["HISTORIAL"][WEB_DATA["HISTORIAL"]["TOTAL"]] = {
    FECHA: TIME["DATE"],
    HORA: TIME["TIME"],
    MOVIMIENTO: T_MOV,
    ID: PLATE,
    DUEÑO: DUEÑO,
    MARCA: MARCA,
  };

  WEB_DATA["HISTORIAL"]["TOTAL"] = Number(WEB_DATA["HISTORIAL"]["TOTAL"]) + 1;

  let TABLE = document.querySelector(".Cn_Control table");
  let NRow = TABLE.insertRow(1);
  let NCell1 = NRow.insertCell(0);
  let NCell2 = NRow.insertCell(1);
  let NCell3 = NRow.insertCell(2);
  let NCell4 = NRow.insertCell(3);
  NCell1.innerHTML = DATA["FECHA"];
  NCell2.innerHTML = DATA["HORA"];
  NCell3.innerHTML = DATA["MOVIMIENTO"];
  NCell4.innerHTML = DATA["ID"];

  let T_TOTAL = TABLE.querySelectorAll("tr");
  if (T_TOTAL.length > 50) {
    T_TOTAL[50].remove();
  }

  document.querySelectorAll(".DEV_Time").forEach((ITEM) => {
    ITEM.textContent = `${TIME["HOUR"]}:${TIME["MINUT"]}`;
  });
  document.querySelector(".Cn_Control #Control_Plates").value = "";
}

function History_List(Force = false) {
  let DOM = document.querySelector(".Cn_Hitorial_Student");
  let T_Search = String(
    DOM.querySelector('input[type="search"]').value
  ).toUpperCase();
  let TABLE = DOM.querySelector("table");
  let ITEMS = TABLE.querySelectorAll("tr");

  let LIST = [];

  if (WEB_DATA["USUARIO"]["LEVEL"] == "DEV") {
    DOM = document.querySelector(".Cn_Historial_Admin");
    T_Search = String(
      DOM.querySelector('input[type="search"]').value
    ).toUpperCase();;
    TABLE = DOM.querySelector("table");
    ITEMS = TABLE.querySelectorAll("tr");
  }

  ITEMS.forEach((Xtem) => {
    let CLASS = Xtem.getAttribute("class") ?? undefined;
    if (CLASS != "Table_Up") {
      Xtem.remove();
    }
  });

  if (WEB_CONFIG["CONEXION"]["METHOD"] != "LOCAL") {
    if (
      Number(WEB_DATA["HISTORIAL"]["TOTAL"]) < 1 ||
      T_Search.length > 1 ||
      Force == true
    ) {
      WEB_DATA["HISTORIAL"]["TOTAL"] = {};
      let WHERE_KEY = String(
        DOM.querySelector('input[type="radio"]:checked  + label').innerHTML
      ).toUpperCase();
      let WHERE = "";

      if(WEB_DATA['USUARIO']['LEVEL'] != "DEV"){
        WHERE = `ID='${WEB_DATA['USUARIO']['VEHICULO']}'`;
      }else {
        if (T_Search.length > 1) {
          if (WHERE_KEY == "PLACA") {
            WHERE_KEY = "ID";
          }
          WHERE = `${WHERE_KEY} LIKE '%${T_Search}%'`;
        }else {
          WHERE = `ID_ABS >= 0`;
        }
      }

      let SEND = {
        DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["HISTORIAL"],
        KEYS: "*",
        WHERE: WHERE,
        ORDER: "ORDER BY ID_ABS DESC",
        LIMIT: 'LIMIT 150',
      };
      SEND_TO_PHP("GET_HISTORY", SEND);

      WEB_DATA['VEHICLES'] = {}
    }
  } else {
    if (T_Search.length > 1 || Force == true) {
      let WHERE_KEY = String(
        DOM.querySelector('input[type="radio"]:checked  + label').textContent
      ).toUpperCase();
      let REG = new RegExp(`^.*${T_Search}.*$`);

      if (T_Search.length > 1) {
        for (
          let Xtem = WEB_USERS["HISTORIAL"]["TOTAL"] - 1;
          Xtem >= 0;
          Xtem--
        ) {
          if (WHERE_KEY == "PLACA") {
            WHERE_KEY = "ID";
          }
          if (
            WHERE_KEY == "TIPO" ||
            WHERE_KEY == "MARCA" ||
            WHERE_KEY == "COLOR"
          ) {
          } else {
            if (String(WEB_USERS["HISTORIAL"][Xtem][WHERE_KEY]).match(REG)) {
              LIST.push(Xtem);
              if (LIST.length > 150) {
                break;
              }
            }
          }
        }
      } else {
        for (let x = WEB_DATA["HISTORIAL"]["TOTAL"] - 1; x > 0; x--) {
          LIST.push(x);
          if (LIST.length > 150) {
            break;
          }
        }
      }
    }
  }

  let TOTAL = 0;
  let RES_COUNT = 25;
  let RESPONSE = setInterval(() => {
    if (WEB_DATA["HISTORIAL"]?.["TOTAL"] != undefined && RES_COUNT >= 0) {
      clearInterval(RESPONSE);

      if (WEB_CONFIG["CONEXION"]["METHOD"] != "LOCAL") {
        TOTAL = WEB_DATA["HISTORIAL"]?.["TOTAL"];
      } else {
        TOTAL = LIST.length;
      }

      if (TOTAL > 0) {
        let LIST_VEHICLES = [];

        for (let x = TOTAL; x >= 0; x--) {
          try {
            if(WEB_DATA['USUARIO']['LEVEL'] != "DEV" && WEB_DATA["HISTORIAL"][x]["DUEÑO"] != WEB_DATA['USUARIO']['ID']){ 
              continue;
            }
            let NRow = TABLE.insertRow(1);
            let NCell1 = NRow.insertCell(0);
            let NCell2 = NRow.insertCell(1);
            let NCell3 = NRow.insertCell(2);
            let NCell4 = NRow.insertCell(3);
            let NCell5 = NRow.insertCell(4);
            let NCell6 = undefined;
            if(WEB_DATA['USUARIO']['LEVEL'] != "DEV"){
              NCell6 = NRow.insertCell(5);
            }

            if (WEB_CONFIG["CONEXION"]["METHOD"] != "LOCAL") {
              NCell1.innerHTML = WEB_DATA["HISTORIAL"][x]["FECHA"];
              NCell2.innerHTML = WEB_DATA["HISTORIAL"][x]["MOVIMIENTO"];
              NCell3.innerHTML = WEB_DATA["HISTORIAL"][x]["HORA"];
              NCell4.innerHTML = WEB_DATA["HISTORIAL"][x]["ID"];
              NCell5.innerHTML = WEB_DATA["HISTORIAL"][x]["DUEÑO"] ?? "";
              if(WEB_DATA['USUARIO']['LEVEL'] != "DEV"){
                NCell6.innerHTML = WEB_DATA["HISTORIAL"][x]["MARCA"] ?? "";
              }
            } else {
              NCell1.innerHTML = WEB_DATA["HISTORIAL"][LIST[x]]["FECHA"];
              NCell2.innerHTML = WEB_DATA["HISTORIAL"][LIST[x]]["MOVIMIENTO"];
              NCell3.innerHTML = WEB_DATA["HISTORIAL"][LIST[x]]["HORA"];
              NCell4.innerHTML = WEB_DATA["HISTORIAL"][LIST[x]]["ID"];
              NCell5.innerHTML = WEB_DATA["HISTORIAL"][LIST[x]]["DUEÑO"] ?? "";
              if(WEB_DATA['USUARIO']['LEVEL'] != "DEV"){
                NCell6.innerHTML = WEB_DATA["HISTORIAL"][LIST[x]]["MARCA"] ?? "";
              }
            }
            LIST_VEHICLES.push(WEB_DATA["HISTORIAL"][x]["ID"]);
          } catch {}
        }
        
        setTimeout(() => {
          if(WEB_CONFIG['CONEXION']['METHOD'] != "LOCAL"){
            let WHERE = ``;
            let XSET = new Set(LIST_VEHICLES);
            if(WEB_DATA['USUARIO']['LEVEL'] == 'DEV'){
              XSET.forEach((Xtem) => {
                if(WHERE.length > 2){ 
                  WHERE += " OR "
                }
                WHERE += `ID='${Xtem}'`;
              })
            } else {
              WHERE = `ID='${WEB_DATA['USUARIO']['VEHICULO']}'`;
            }
            let SEND = {
              DB_TABLE: WEB_CONFIG['DATABASE']['TABLA']['VEHICULOS'],
              WHERE: WHERE,
              ORDER: "ORDER BY DUEÑO ASC",
              LIMIT: 'LIMIT 150',
            }
            SEND_TO_PHP('VEHICLES_LIST', SEND);
          } 
        }, 50)
      }
    }
    if (RES_COUNT < 0) {
      clearInterval(RESPONSE);
      APP_ALERT("ERROR", 2);
    }
    RES_COUNT -= 1;
  }, 200);

  RES_COUNT = 25;
  let RESPONSE2 = setInterval(() => {
    if (WEB_DATA['VEHICLES']?.["TOTAL"] != undefined && RES_COUNT >= 0) {
      clearInterval(RESPONSE2);

      let NM = TABLE.querySelectorAll('tr');
      for(let x=1; x<NM.length; x++){
        let XID = String(NM[x].querySelector('td:nth-child(4)').textContent);
        if(WEB_DATA['VEHICLES']?.[XID] != undefined){
          NM[x].querySelector('td:nth-child(5)').textContent = `${WEB_DATA['VEHICLES'][XID]['DUEÑO']}`;
          NM[x].querySelector('td:nth-child(6)').textContent = `${WEB_DATA['VEHICLES'][XID]['MARCA']}`;
        }
      }
    }
    
    if (RES_COUNT < 0) {
      clearInterval(RESPONSE);
    }
    RES_COUNT -= 1;
  }, 200)
}

function Vehicle_List() {
  WEB_DATA["VEHICLES"] = {};

  let DOM = document.querySelector(".Cn_Info_Admin");
  let T_Search = String(DOM.querySelector("#Vehicle_Search").value).toUpperCase();
  let TABLE = DOM.querySelector("table");
  let ITEMS = TABLE.querySelectorAll("tr");

  ITEMS.forEach((Xtem) => {
    let CLASS = Xtem.getAttribute("class") ?? undefined;
    if (CLASS != "Table_Up") {
      Xtem.remove();
    }
  });

  if (WEB_CONFIG["CONEXION"]["METHOD"] != "LOCAL" && T_Search.length > 1) {
    let WHERE_KEY = String(
      DOM.querySelector('input[name="Info_Search_Admin"]:checked  + label')
        .textContent
    ).toUpperCase();
    let WHERE = "";

    if (WHERE_KEY.length > 1) {
      if (WHERE_KEY == "PLACA") {
        WHERE_KEY = "ID";
      }
      WHERE = `${WHERE_KEY} LIKE '%${T_Search}%'`;
    }

    let SEND = {
      DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["VEHICULOS"],
      KEYS: "*",
      WHERE: WHERE,
      ORDER: "ORDER BY 'DUEÑO' ASC",
      LIMIT: 'LIMIT 150',
    };
    SEND_TO_PHP("VEHICLES_LIST", SEND);
  } else {
  }

  let TOTAL = 0;
  let RES_COUNT = 35;
  let RESPONSE = setInterval(() => {
    if (WEB_DATA["VEHICLES"]?.["TOTAL"] != undefined) {
      clearInterval(RESPONSE);
      TOTAL = WEB_DATA["VEHICLES"]?.["TOTAL"];
      if (TOTAL > 0) {
        let KEYS = Object.keys(WEB_DATA['VEHICLES']);
        KEYS.forEach((x) => {
          if(x != "TOTAL"){
            try {
              let NRow = TABLE.insertRow(1);
              let NCell1 = NRow.insertCell(0);
              let NCell2 = NRow.insertCell(1);
              let NCell3 = NRow.insertCell(2);
              let NCell4 = NRow.insertCell(3);
              let NCell5 = NRow.insertCell(4);
              let NCell6 = NRow.insertCell(5);
  
              NCell1.innerHTML = `<a href="#" onclick="Info_Menu(${WEB_DATA["VEHICLES"][x]["DUEÑO"]})">${WEB_DATA["VEHICLES"][x]["DUEÑO"]}</a>`;
              NCell2.innerHTML = WEB_DATA["VEHICLES"][x]["ID"];
              NCell3.innerHTML = WEB_DATA["VEHICLES"][x]["TIPO"];
              NCell4.innerHTML = WEB_DATA["VEHICLES"][x]["MARCA"];
              NCell5.innerHTML = WEB_DATA["VEHICLES"][x]["MODELO"];
              NCell6.innerHTML = WEB_DATA["VEHICLES"][x]["COLOR"];
            } catch {}
          }
        }) 
      }
    }

    if (RES_COUNT < 0) {
      clearInterval(RESPONSE);
      APP_ALERT("ERROR", 2);
    }
    RES_COUNT -= 1;
  }, 200);
}

function Send_Email() {
  let DOM = document.querySelector("#Mn_Recuperar");
  let USER = DOM.querySelector('input[id="Forget_Email"]').value;
  let EMAIL = DOM.querySelector('input[id="Forget_Email2"]').value;

  if (USER.length > 2 || EMAIL.length > 2) {
    let SEND = {
      DB_HOST: WEB_CONFIG["DATABASE"]["HOST"],
      DB_USER: WEB_CONFIG["DATABASE"]["USER"],
      DB_PASSWORD: WEB_CONFIG["DATABASE"]["PASSWORD"],
      DB_NAME: WEB_CONFIG["DATABASE"]["NOMBRE"],
      DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["HISTORIAL"],
      TABLE_KEYS: "(FECHA, HORA)",
      VALUES: `('${USER}', '${EMAIL}')`,
    };
    //SEND_TO_PHP("FORGOTED_USER", SEND);
    GOTO_MENU("Login");
  } else {
  }
}

function Send_Report(MOTIVO) {
  let TIME = GET_TIME();
  let DOM = document.querySelector(".Cn_Report");
  let R_MOTIVE = "";
  let R_TEXT = DOM.querySelector("textarea");

  if (MOTIVO == 0) {
    R_MOTIVE = "RECLAMO";
  } else if (MOTIVO == 1) {
    R_MOTIVE = "FALLO";
  } else {
    R_MOTIVE = "OTRO";
  }

  let SEND = {
    DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["REPORTES"],
    KEYS: "(FECHA, ID, MOTIVO, TEXTO, RESUELTO)",
    VALUES: `'${TIME["DATE"]}','${WEB_DATA["USUARIO"]["ID"]}','${R_MOTIVE}','${R_TEXT.value}', '0'`,
  };

  SEND_TO_PHP("SEND_REPORT", SEND);

  R_TEXT.value = "";
  GOTO_MENU("Principal");
}

function Update_Last_Control() {
  let TIME = GET_TIME();
  let T_MOV = document.querySelector(
    '.Cn_Control input[name="Control"]:checked'
  ).value;
  let PLATE = String(
    document.querySelector(".Cn_Control #Control_Plates").value
  ).toUpperCase();
  if (PLATE.length < 2) {
    return false;
  }

  let TABLE = document.querySelector(".Cn_Control table");
  let NRow = TABLE.querySelector('tr[class="Table_Up"] + tr');
  let NCell = NRow.querySelectorAll("td");

  if (WEB_CONFIG["CONEXION"]["METHOD"] != "LOCAL") {
    let KEYS = "(FECHA, HORA, MOVIMIENTO, ID, ID_ADMIN)";
    let SET = `FECHA='${TIME["DATE"]}', HORA='${TIME["TIME"]}', MOVIMIENTO='${T_MOV}', ID='${PLATE}', ID_ADMIN='${WEB_DATA["USUARIO"]["ID"]}'`;
    let WHERE = `FECHA = '${NCell[0].innerText}' AND HORA = '${NCell[1].innerText}' AND ID = '${NCell[3].innerHTML}'`;
    let VALUES = '';

    let SEND = {
      DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["HISTORIAL"],
      WHERE: WHERE,
      KEYS: KEYS,
      SET: SET,
      VALUES: VALUES,
    };
    SEND_TO_PHP("NEW_CONTROL", SEND);
  }

  WEB_DATA["HISTORIAL"][WEB_DATA["HISTORIAL"]["TOTAL"] - 1]["MOVIMIENTO"] =
    T_MOV;
  WEB_DATA["HISTORIAL"][WEB_DATA["HISTORIAL"]["TOTAL"] - 1]["ID"] = PLATE;
  NCell[2].innerHTML = T_MOV;
  NCell[3].innerHTML = PLATE;

  document.querySelectorAll(".DEV_Time").forEach((ITEM) => {
    ITEM.textContent = `${TIME["HOUR"]}:${TIME["MINUT"]}`;
  });
  document.querySelector(".Cn_Control #Control_Plates").value = "";
}

function Register_User() {
  let TIME = GET_TIME();
  let DOM = document.querySelector('form[class="Cn_Registro"]');

  let LEVEL = DOM.querySelector('input[name="User_Level"]:checked').value;
  let CODE = String(
    DOM.querySelector('input[id="R_Code"]').value
  ).toUpperCase();
  let NOMBRE = String(
    DOM.querySelector('input[id="User_Name"]').value
  ).toUpperCase();
  let FECHA = DOM.querySelector('input[id="User_Date"]').value;
  let CORREO = String(
    DOM.querySelector('input[id="Email"]').value
  ).toUpperCase();
  let TELEFONO_1 = String(
    DOM.querySelector('input[id="Tel"]').value
  ).toUpperCase();
  let PASSWORD_1 = DOM.querySelector('input[id="User_Password"]').value;
  let PASSWORD_2 = DOM.querySelector('input[id="User_Password_2"]').value;
  let TIPO = DOM.querySelector('input[name="V_Type"]:checked').value;
  let MARCA = String(
    DOM.querySelector('input[id="V_Mark"]').value
  ).toUpperCase();
  let MODELO = String(
    DOM.querySelector('input[id="V_Model"]').value
  ).toUpperCase();
  let YEAR = DOM.querySelector('input[id="V_Year"]').value;
  let COLOR = String(
    DOM.querySelector('input[id="V_Color"]').value
  ).toUpperCase();
  let PLACA = String(
    DOM.querySelector('input[id="V_Plate"]').value
  ).toUpperCase();
  let DETALLES = String(
    DOM.querySelector('input[id="V_Detail"]').value
  ).toUpperCase();

  if(PASSWORD_1 != PASSWORD_2){ return false;}

  let IMAGE1 = document.querySelector('#R_IMG1');
  let IMAGE2 = document.querySelector('#R_IMG2');

  let TIMG1 = "";
  let TIMG2 = "";

  if (IMAGE1.files.length > 0) {
    IMAGE1 = IMAGE1.files[0];
    let READER = new FileReader();
    READER.onloadend = () => {
      TIMG1 = READER.result;
    };
    READER.readAsDataURL(IMAGE1);
  } else {
    TIMG1 = "";
  }

  if (IMAGE2.files.length > 0) {
    IMAGE2 = IMAGE2.files[0];
    let READER = new FileReader();
    READER.onloadend = () => {
      TIMG2 = READER.result;
    };
    READER.readAsDataURL(IMAGE2);
  } else {
    TIMG2 = "";
  }


  let NOMBRES = String(NOMBRE).split(" ");
  let NAME = "";
  for (let x = 0; x < NOMBRES.length - 2; x++) {
    NAME += `${NOMBRES[x]} `;
  }
  NOMBRES = String(NOMBRE).replace(NAME, "");
  NOMBRES = NOMBRES.split(" ");
  let APELLIDO_1 = NOMBRES[0];
  let APELLIDO_2 = NOMBRES[1];

  if (WEB_CONFIG["CONEXION"]["METHOD"] != "LOCAL") {
    let WAIT = 50;
    let WAIT2 = 50;
    if(IMAGE1.length > 0){WAIT = 500;}
    if(IMAGE2.length > 0){WAIT2 = 250;}
    setTimeout(() => {
      let XKEYS = "(ID, NOMBRE, APELLIDO_1, APELLIDO_2, FECHA, TELEFONO, CORREO, LEVEL, VEHICULO, ULTIMA_VEZ, IMG)";
      let VALUES = `'${CODE}','${NAME}','${APELLIDO_1}','${APELLIDO_2}','${FECHA}','${TELEFONO_1}','${CORREO}','${LEVEL}','${PLACA}','POR_REGISTRAR','${TIMG1}'`;
      let WHERE = "";
      let SET = "";
  
      if(WEB_DATA['USUARIO']['ID'] == CODE && WEB_DATA['USUARIO']['NOMBRE'].length > 3){
        WHERE = `ID='${CODE}'`;
        SET = `ID='${CODE}',NOMBRE='${NAME}',APELLIDO_1'${APELLIDO_1}',APELLIDO_2'${APELLIDO_2}',FECHA='${FECHA}',TELEFONO_1='${TELEFONO_1}',CORREO='${CORREO}',LEVEL='${LEVEL}',PLACA='${PLACA}',TIME='${TIME["DATE"]}',IMG='${TIMG1}'`;
      }
  
      let SEND = {
        DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["USERS_DATA"],
        WHERE: WHERE,
        SET: SET,
        KEYS: XKEYS,
        VALUES: VALUES,
      };
      SEND_TO_PHP("NEW_USER", SEND);
      
      XKEYS = "(ID,USER_PASSWORD,CORREO)";
      VALUES = `'${CODE}','${PASSWORD_1}','${CORREO}'`;
      WHERE = `ID='${CODE}'`;
      SET = "";
  
      SEND = {
        DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["LOGIN"],
        WHERE: WHERE,
        SET: SET,
        KEYS: XKEYS,
        VALUES: VALUES,
      };
      SEND_TO_PHP("TRY_ADD_USER", SEND);
  
      setTimeout(() => {
        XKEYS = "(ID, PLACA, TIPO, MARCA, MODELO, AÑO, DUEÑO, COLOR, DETALLES, IMG)";
        VALUES = `'${PLACA}','${PLACA}','${TIPO}','${MARCA}','${MODELO}','${YEAR}','${CODE}','${COLOR}','${DETALLES}','${TIMG2}'`;
        WHERE = "";
        SET = "";
  
        if(WEB_DATA['USUARIO']['ID'] == CODE && WEB_DATA['USUARIO']['NOMBRE'].length > 3){
          WHERE = `DUEÑO='${CODE}' AND ID='${PLACA}'`;
          SET = `ID='${CODE}',PASSWORD='${PASSWORD_1}',NOMBRE='${NAME}',APELLIDO_1'${APELLIDO_1}',APELLIDO_2'${APELLIDO_2}',FECHA='${FECHA}',TELEFONO_1='${TELEFONO_1}',CORREO='${CORREO}',LEVEL='${LEVEL}',PLACA='${PLACA}',TIME='${TIME["DATE"]}'`;
        }
  
        let SEND2 = {
          DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["VEHICULOS"],
          WHERE: WHERE,
          SET: SET,
          KEYS: XKEYS,
          VALUES: VALUES,
        };
        SEND_TO_PHP("NEW_VEHICLE", SEND2);
      }, WAIT2)
    }, WAIT)


    setTimeout(() => {
      APP_ALERT("REGISTRO", 1);
    }, 650);
  } else {
    WEB_USERS["USERS"][CODE] = { PASSWORD: PASSWORD_1, CORREO: CORREO };
    WEB_USERS["DATA"][CODE] = {
      ID: CODE,
      NOMBRE: NAME,
      APELLIDO_1: APELLIDO_1,
      APELLIDO_2: APELLIDO_2,
      FECHA: FECHA,
      TELEFONO_1: TELEFONO_1,
      CORREO: CORREO,
      HISTORIAL: {},
    };
    WEB_USERS["VEHICULOS"][CODE] = {
      PLACA: PLACA,
      MARCA: MARCA,
      MODELO: MODELO,
      AÑO: YEAR,
      COLOR: COLOR,
      DETALLES: DETALLES,
      TIPO: TIPO,
      DUEÑO: CODE,
    };
  }
  GOTO_MENU("Loading");
  setTimeout(() => {
    GOTO_MENU("Login");
    DOM.querySelector('input[id="R_Code"]').value = "";
    DOM.querySelector('input[id="User_Name"]').value = "";
    DOM.querySelector('input[id="User_Date"]').value = "";
    DOM.querySelector('input[id="Email"]').value = "";
    DOM.querySelector('input[id="Tel"]').value = "";
    DOM.querySelector('input[id="User_Password"]').value = "";
    DOM.querySelector('input[id="User_Password_2"]').value = "";
    DOM.querySelector('input[id="V_Mark"]').value = "";
    DOM.querySelector('input[id="V_Model"]').value = "";
    DOM.querySelector('input[id="V_Year"]').value = "";
    DOM.querySelector('input[id="V_Color"]').value = "";
    DOM.querySelector('input[id="V_Plate"]').value = "";
    DOM.querySelector('input[id="V_Detail"]').value = "";
    IMAGE1.files = [];
    IMAGE2.files = [];
  }, 2050);
}

function Update_User() {
  GOTO_MENU("Loading");

  let TIME = GET_TIME();
  let DOM = document.querySelector('form[class="Cn_Registro"]');

  let CODE = DOM.querySelector('input[id="R_Code"]');
  let NOMBRE = DOM.querySelector('input[id="User_Name"]');
  let FECHA = DOM.querySelector('input[id="User_Date"]');
  let CORREO = DOM.querySelector('input[id="Email"]');
  let TELEFONO_1 = DOM.querySelector('input[id="Tel"]');
  let MARCA = DOM.querySelector('input[id="V_Mark"]');
  let MODELO = DOM.querySelector('input[id="V_Model"]');
  let YEAR = DOM.querySelector('input[id="V_Year"]');
  let COLOR = DOM.querySelector('input[id="V_Color"]');
  let PLACA = DOM.querySelector('input[id="V_Plate"]');
  let DETALLES = DOM.querySelector('input[id="V_Detail"]');

  CODE.value = WEB_DATA["USUARIO"]["ID"];
  NOMBRE.value = `${WEB_DATA["USUARIO"]["NOMBRE"]} ${WEB_DATA["USUARIO"]["APELLIDO_1"]} ${WEB_DATA["USUARIO"]["APELLIDO_2"]}`;
  FECHA.value = WEB_DATA["USUARIO"]["FECHA"];
  CORREO.value = WEB_DATA["USUARIO"]["CORREO"];
  if (WEB_DATA["USUARIO"]["TELEFONO_1"] != undefined) {
    TELEFONO_1.value = WEB_DATA["USUARIO"]["TELEFONO_1"];
  }
  MARCA.value = WEB_DATA["USUARIO_EXT"]["MARCA"];
  MODELO.value = WEB_DATA["USUARIO_EXT"]["MODELO"];
  YEAR.value = WEB_DATA["USUARIO_EXT"]["AÑO"];
  COLOR.value = WEB_DATA["USUARIO_EXT"]["COLOR"];
  PLACA.value = WEB_DATA["USUARIO_EXT"]["PLACA"];
  if (WEB_DATA["USUARIO_EXT"]["DETALLES"] != undefined) {
    DETALLES.value = WEB_DATA["USUARIO_EXT"]["DETALLES"];
  }

  setTimeout(() => {
    GOTO_MENU("Registro");
  }, 150);
}

function Config(value) {
  let SEND = {
    DB_HOST: WEB_CONFIG["DATABASE"]["HOST"],
    DB_USER: WEB_CONFIG["DATABASE"]["USER"],
    DB_PASSWORD: WEB_CONFIG["DATABASE"]["PASSWORD"],
    DB_NAME: WEB_CONFIG["DATABASE"]["NOMBRE"],
    DB_TABLE: WEB_CONFIG["DATABASE"]["TABLA"]["HISTORIAL"],
    VALUES: `'${value}'`,
  };
  return SEND;
}

function ACCEPT_USER(ID, KEY){
  let TIME = GET_TIME();
  if(WEB_CONFIG['CONEXION']['METHOD'] != "LOCAL"){
    let WHERE =  `ID='${ID}' AND ULTIMA_VEZ='POR_REGISTRAR'`;
    let SET = `ULTIMA_VEZ='${TIME['DATE']}'`;

    let SEND = {
      DB_TABLE: WEB_CONFIG['DATABASE']['TABLA']['USERS_DATA'],
      WHERE: WHERE,
      SET: SET,
      DEV_KEY: KEY, 
    }
    SEND_TO_PHP("ACCEPT_USER",SEND);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  GOTO_MENU("Login");

  let Config = LOAD_LOCAL();
  if (Config == true) {
    if (WEB_CONFIG["DATABASE"]["HOST"] == null) {
      console.warn(
        "ALERTA -> No hay una base de datos definida en la configuracion."
      );
    }
    if (WEB_CONFIG["CONEXION"]["METHOD"] == "LOCAL") {
    }

    if (WEB_CONFIG["CONEXION"]["METHOD"] == null) {
      WEB_CONFIG["CONEXION"] = {
        METHOD: "LOCAL",
        MODE: "LOCAL",
        SEGURITY: "LOCAL",
      };
    }
  } else {
    console.error("ERROR -> Ocurrio un problema al cargar la configuracion.");
  }

  setTimeout(() => {
    WEB_DATA["USUARIO"] = {
      ID: "",
      NOMBRE: "",
      APELLIDO_1: "",
      APELLIDO_2: "",
      GENERO: "",
      FECHA: "",
      TELEFONO_1: "",
      CORREO: "",
      LEVEL: "",
      VEHICULO: "",
    };
  }, 1250);
});
