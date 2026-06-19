const mongoose = require('mongoose')

/**
 * -Job description : String
 * -Resume text : String
 * -selff description : String
 * 
 * -matchScore:{
 *      type : Number
 * }
 * 
 * -Technical question:
 * [
 * {
 *  Question:"",
 *  Reason/intenstion :"",
 *  Answer:"",
 *  }
 * ]
 * -Behavioral question:[
 * {
 *  Question:"",
 *  Reason/intenstion :"",
 *  Answer:"",
 *  }
 * ]
 * -Skill gaps:[
 * {
 * skill:"",
 *  severity:{
 *  type : String,
 *  enum : ["low","medium","high"]
 * }
 * }
 * ]
 * -Preparation plan :[
 * {
 *  Day : Number ,
 * focus : String,
 *  taks :[String]
 * 
 * }]
 * --
 */