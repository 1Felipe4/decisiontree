





//Defining Class Of All Nodes, Is Abstract
class Node {

  // var options;
  // var desc;
  // var value;
  // var ans;
  // var name;

  constructor(name, desc) {
    if(this.constructor === Node){
    throw new Error("You cannot create instance of Abstract Class");
  }


    this._name = name;
    this._desc = desc;
    this._value = '';
    this._ans= '';
    this._options = [];


}
  getOption(){
    throw new Error("Abstract Node");
  }

  display(){
    throw new Error("Abstract Node");
  }



  get options(){

    return this._options;
  }

  set options(x){
    this._options = x;
  }

  get desc(){
    return this._desc;
  }

  set desc(x){
    this._desc = x;
  }

  get value(){
    return this._value;
  }

  set value(x){
    this._value = x;
  }

  get name(){
    return this._name;
  }

  set name(x){
    this._name = x;
  }



}

//Type Node, Allows User Input Choice
class Decision extends Node{
  constructor(name, desc){//Construct
    super(name, desc);

  }

  addOption(n, choice){
    if(!(n  instanceof Node)){
      throw new Error("Not Node");
    }

    this._options[choice.toLowerCase()] = n;
  }


//Recursive
//Each Decision Answer Is Dependent On Its Child
//It Tries To Get The Answer Of It's Child || Once Answer Recieved We Can Return It
//Must Prompt If There Is No Value
get ans(){

  //Check If User Made Selection
  if(this.value === ''){//No Selection
    this.prompt();//Prompt Selection

  }else{
    this.ans = this.getOption();
    //If A selection was made || Get The Answer Value For This Option
  }

  //Once Have Answer || Return It
  return this._ans;

}

set ans(x){
  //Set Answer To Given Node's Answer (Usually Child/Option Node)
  this._ans = x.ans;
}

//Get User Selected Option
  getOption(){
    var rads = document.getElementsByName(this.name);
    rads.forEach((item, i) => {
      if(item.checked === true){
        this.value = item.value.toLowerCase();
      }
    });


    return this.options[this.value];
  }
  //Get User Input
  //Make Every Option Into A Formatted Radio Button

  display(){
  let sect = $("<section></section>");
  $(sect).css({"overflow": "hidden"});
  let head = $("<h3></h3>");

  $(head).text(this.desc);
  $(sect).append(head);

  var curr = this;

  var keys = Object.keys(this.options); //Keys Of Array
  keys.forEach((item, i) => {//Each Key At A Time || Each Option At A Time
    //Formatting Divs
    let div = $("<div> </div>");
    $(div).css({"width":"30%", "overflow":"hidden", "border":"2px solid black",
    "marginBottom":"2%", "padding":"1%"});

    let lbl = $("<label></label>");
    $(lbl).css({"width":"70%", "float":"left"});
    $(lbl).text(item.charAt(0).toUpperCase() + item.substring(1));

    //Radio Button || Format
    let inp = $("<input type=\"radio\">");
    $(inp).attr("value", item);
    $(inp).attr("checked", "true");
    $(inp).attr("name", this.name);
    $(inp).css({"width":"20%", "float":"left"});

    $(div).append(lbl);
    $(div).append(inp);

    var  s= 'input[name=\"' + this.name + '\"]'; //JQuery Selector
    var curr = this;
    //s Is Query Selector
    $(div).on('click', s ,function(){//Delegate Event
      //On Click

      //Set Node Value To Value of this(the radio button) value
      curr.value = this.value;

      $(next).show(500);
      //Update Answer
      //document.getElementById("display").innerHTML= tree.ans;
    });
    $(sect).append(div);

  });

  let next = $("<button> </button>");
  $(next).css({"width":"10%", "padding":"1%", "overflow":"hidden","marginBottom":"2%",
  "backgroundColor":"darkgreen", "float":"left", "border":"none"});
  $(next).text("Next");
  $(next).hide();
  $(sect).append(next);


  $(next).on('click', next ,function(){//Delegate Event
    curr.getOption($("input[checked]").val()).display();

  });

  $(sect).on('mouseover', next ,function(){//Delegate Event
    next.css({"cursor":"pointer"});
  });

$("#fill").html(sect);





  }


}

//Chance Node, Choose Random Option
class Chance extends Node {
  constructor(name, desc){//Construct
    super(name, desc);

  }

  addOption(n){
    var choice = "" + this.options.length;
    if(!(n  instanceof Node)){
      throw new Error("Not Node");
    }

    this._options[choice.toLowerCase()] = n;
  }



//Get Option At Random
getOption(){
  //Random Value From Associative Array
  var randomProperty = function (x) {
  var keys = Object.keys(x.options); //Array Keys
  return x.options[keys[Math.floor(keys.length * Math.random())]];
  //Choose Randome From Keyss And Get From Options
};
return randomProperty(this);//Return Random Property
}

//Answer Gets From Child/Option Node
get ans(){
  this.ans = this.getOption().ans;
  return this._ans;
}

set ans(x){
  this._ans = this.getOption().ans;
}


display(){
  this.getOption($("input[checked]").val()).display();
  $("#fill").html(sect);

}

}

//End Only Node That Has Definite Answer And Returns it
//Will End A Branch Recursion
class End extends Node {
  constructor(name, desc, ans) {
    super(name, desc);
    this._ans = ans;

  }

  addOption(){
    console.log("End Node Cannot Add");
  }

  get ans(){
    return this._ans;
  }

  set ans(x){
    this._ans = x;
  }

  getOption(){
    return this;
  }

  display(){
  let sect = $("<section></section>");
  $(sect).css({"overflow": "hidden"});
  let head = $("<h3></h3>");

  $(head).text(this.desc);
  $(sect).append(head);

  var curr = this;

    let item = this.getOption();

    //Formatting Divs
    let div = $("<div> </div>");
    $(div).css({"width":"20%", "overflow":"hidden", "border":"2px solid black",
    "marginBottom":"2%", "padding":"1%"});



    //Input || Format
    let inp = $("<p> </p>");
    $(inp).text(this.ans);
    $(inp).attr("name", this.name);

    $(div).append(inp);
    $(sect).append(div);


  $("#fill").html(sect);
  }

}


class DecisionTree{
//Holds The Root Node For The Decision Tree, And Also Manages It
  constructor(root = ""){
    if(root instanceof Node){
      this._root = root;


    }else {
      this.promptWhereAdd();

    }

    this.where = null;
  }

createNode(type, info, curr){
  var n;
  let choice = info["Choice"].value;
  switch (type) {
    case "Decision":
    n = new Decision(info["Name"].value, info["Description"].value);
      break;
      case "Chance":
      n = new Chance(info["Name"].value, info["Description"].value);
        break;
        case "End":
        n = new End(info["Name"].value, info["Description"].value, info["Answer"].value);
          break;
  }
      if(curr.where == "Root"){
        curr.root = n;
      }else{
        curr.findNode(curr.where).addOption(n, choice);
      }


}

promptWhereAdd(){
  var curr = this;
  let sect = $("<section></section>");
  $(sect).css({"overflow": "hidden"});
  let head = $("<h3></h3>");

  $(head).text("Where To Add This Node");
  $(sect).append(head);
  var options = [];
  options = options.concat(this.findDecisions());
  options = options.concat(this.findChances());

      var rootDiv =$("<div> </div");
      $(rootDiv).css({"width":"20%", "overflow":"hidden", "border":"2px solid black",
      "marginBottom":"2%", "padding":"1%"});
      var rootLbl = $("<label> </label");
      $(rootLbl).text("On Root")
      $(rootLbl).css({"width":"70%", "float":"left"});

      let inp = $("<input type=\"radio\">");
      $(inp).attr("value", "Root");
      $(inp).attr("checked", "true");
      $(inp).attr("name", "checkNode");
      $(inp).css({"width":"20%", "float":"left"});



      $(rootDiv).append(rootLbl);
      $(rootDiv).append(inp);

      $(sect).append(rootDiv);
      var  s= 'input[name=\"' + "checkNode" + '\"]';

      $(rootDiv).on('click', s ,function(){//Delegate Event
          curr.where = this.value;
          curr.promptNewNode(null, curr);

            });

      let to = $("<h4>To: </h4>");
      $(to).hide();
      $(sect).append(to);


      options.forEach((item, i) => {//Each Key At A Time || Each Option At A Time
        $(to).show();
        let div = $("<div> </div>");
        $(div).css({"width":"20%", "overflow":"hidden", "border":"2px solid black",
        "marginBottom":"2%", "padding":"1%"});

        let lbl = $("<label></label>");
        $(lbl).css({"width":"70%", "float":"left"});
        $(lbl).text(item.name.charAt(0).toUpperCase() + item.name.substring(1));

        //Radio Button || Format
        let inp = $("<input type=\"radio\">");
        $(inp).attr("value", item.name);
        $(inp).attr("checked", "true");
        $(inp).attr("name", "checkNode");
        $(inp).css({"width":"20%", "float":"left"});

        $(div).append(lbl);
        $(div).append(inp);


          s= 'input[name=\"' + "checkNode" + '\"]'; //JQuery Selector
        //s Is Query Selector
        $(div).on('click', s ,function(){//Delegate Event
          console.log("here");
          curr.where = this.value;

          curr.promptNewNode(null, curr);

        });
        $(sect).append(div);
      });



      $("#fill").html(sect);
  }

promptNewNode(type, tree){
var box = document.createElement("section");
var head = document.createElement("h3");
head.innerText = "Create Node";
box.appendChild(head);
var types = ["Decision", "Chance", "End"];
  switch (type) {
    case types[0]:

    box = this.promptNodeInfo(box, types[0], tree);
      break;
      case types[1]:
      box = this.promptNodeInfo(box, types[1], tree);
        break;
        case types[2]:
        box = this.promptNodeInfo(box, types[2],tree,["Name", "Description", "Answer", "Choice"]);
          break;
    default:
    types.forEach((item, i) => {//Each Key At A Time || Each Option At A Time

      let lbl = document.createElement("label");//Label radio Button
      //Style Label
      lbl.style.width = "70%";
      lbl.style.float = "left";
      lbl.innerText = item.charAt(0).toUpperCase() + item.substring(1); //Captilize First Letter


      //Div To  Hold Each Label And Button Pair\

      //Formatting Divs
      var div = document.createElement("div");
      div.style.width ="80%";//%80 of Page
      div.style.overflow = "hidden";
      div.style.border = "2px solid black";
      div.style.marginBottom = "2%";
      div.style.padding = "1%";

      //Radio Button || Format
      let rad = document.createElement("input");
      rad.type = "radio";
      rad.value = item; //Value Of Option Key
      rad.checked = true; //Default Select
      rad.name = "createNode"; //Name Set = Node Name
      rad.style.width = "20%";
      rad.style.float = "left";

      div.appendChild(lbl);
      div.appendChild(rad);
      box.appendChild(div);

      var curr = this;
      var  s= 'input[name=\"' + rad.name + '\"]'; //JQuery Selector
      //s Is Query Selector
      $(div).on('click', s ,function(){//Delegate Event

        curr.promptNewNode(this.value, tree);

      });

    });


}

$("#fill").html(box);

}

promptNodeInfo(box, type, tree, vals = ["Name", "Description", "Choice"]){
  var head = document.createElement("h4");
  head.innerText = type;
  box.appendChild(head);


  vals.forEach((item, i) => {//Each Key At A Time || Each Option At A Time

    let lbl = document.createElement("label");//Label radio Button
    //Style Label
    lbl.style.width = "40%";
    lbl.style.float = "left";
    lbl.innerText = item.charAt(0).toUpperCase() + item.substring(1); //Captilize First Letter


    //Div To  Hold Each Label And Button Pair\

    //Formatting Divs
    var div = document.createElement("div");
    div.style.width ="50%";//%50 of Page
    div.style.overflow = "hidden";
    div.style.border = "2px solid black";
    div.style.marginBottom = "2%";
    div.style.padding = "1%";

    //Text || Format
    let rad = document.createElement("input");
    rad.type = "text";
    rad.placeholder = item;
    rad.name = item; //Name Set = Node Name
    rad.style.width = "50%";
    rad.style.float = "left";

    div.appendChild(lbl);
    div.appendChild(rad);
    box.appendChild(div);

  });

  var button = document.createElement("input");
  button.type = "button";
  button.name = type;
  button.value = "Submit Info";

  box.appendChild(button);
  var curr = this;
  var  s= 'input[name=\"' + button.name + '\"]'; //JQuery Selector
  //s Is Query Selector
  $(box).on('click', s ,function(){//Delegate Event
   let inputs = document.getElementsByTagName('input');

   curr.createNode(type, inputs, tree);
  });

  return box

}

set temp(x){
  this._temp = x;
}

get temp(){
  return this._temp;
}

set root(x){
  this._root = x;
}

get root(){
  return this._root;
}

display(){

  this.root.display();

}


//This allows A Prompt Answer To be Returned


//Find A Node Withing The Tree, By Name || Uses Recursion
findNode(name, op = this.root){
    var val;
    if(op instanceof Node && op.name == name){
      return op;

    }

    if (op instanceof Node) {
      op = op.options;
    }


    var keys = Object.keys(op);
     keys.forEach((item, i) => {
      if(op[item].name == name){
        val = op[item];

      }
    });


    if(val instanceof Node){
      return val;
    }

      keys.forEach((item, i) => {
      if(this.findNode(name, op[item].options) instanceof Node){
        val =  this.findNode(name, op[item].options);
      }
    });



    if(val instanceof Node){
      return val;
    }




  return val;
}

findEnds(op = this.root){
    var val = []
    if(op instanceof End){
       val.push(op);

    }

    if (!(op instanceof Array)) {
      op = op.options;
    }



    var keys = Object.keys(op);
    if(keys.length > 0){
     keys.forEach((item, i) => {
      if(op[item] instanceof End){
        val.push(op[item]);
      }
    });

      keys.forEach((item, i) => {
        val = val.concat(this.findEnds(op[item].options));
    });
}

    return val;
}

findDecisions(op = this.root){
    var val = []



    if(op instanceof Decision){
      val.push(op);

    }
    if(!(op instanceof Array) && op){
      op = op.options;




    var keys = Object.keys(op);
     keys.forEach((item, i) => {
      if(op[item] instanceof Decision ){
        val.push(op[item]);
      }
    });


      keys.forEach((item, i) => {
        if(op[item].options){

      val = val.concat(this.findDecisions(op[item].options));
    }
    });
}


  return val;
}

findChances(op = this.root){
  var val = []
  if(op instanceof Chance){
     val.push(op);

  }

  if (!(op instanceof Array) && (op instanceof Node)) {
    op = op.options;




  var keys = Object.keys(op);
  if(keys.length > 0){
   keys.forEach((item, i) => {
    if(op[item] instanceof Chance){
      val.push(op[item]);
    }
  });


    keys.forEach((item, i) => {
      val = val.concat(this.findChances(op[item].options));
  });
}
}

  return val;
}

}

//Configure tree
//So Far Only By HardCode
//Will Update To user Friendly Design || Challenge? Maybe?

var walk = new Decision("walk", "Go For A Walk");

var umbrella = new Decision("umbrella", "Take Umbrella");

var weather1 = new Chance("YesUmbrella","Weather With Umbrella");
var weather2 = new Chance("NoUmbrella", "What Without Umbrella");

var rain1 = new End("End1", "Rain Falls", "The Rain Falls, Lucky You Took It");
var sun1 = new End("End2", "Sun Shines", "The Sun Shines, Wish I Left It");

 var rain2 = new End("End3", "Rain Falls", "The Rain Falls, You Are Soaked");
 var sun2 = new End("End4", "Sun Shines", "The Sun Shines, Nice I Left It");

  var home = new End("End5", "Rick & Morty", "You Stay Home and Watch Tv");

walk.addOption(umbrella, "yes");
walk.addOption(home, "no");


weather1.addOption(rain1);
weather1.addOption(sun1);

weather2.addOption(rain2);
weather2.addOption(sun2);

umbrella.addOption(weather1, "yes");
umbrella.addOption(weather2, "no");

var tree= new DecisionTree(walk);

var test = new DecisionTree();

// //Display
// $(function(){
//     $("#display").html(tree.ans);
// });
