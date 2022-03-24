const { Client, MessageEmbed } = require('discord.js')
const fs = require('fs');
const { prefix, token, perrol } = require('./config.json');
const client = new Client({
	disableEveryone: true
});
const { google } = require('googleapis');
const { firebaserules } = require('googleapis/build/src/apis/firebaserules');
const { Console } = require('console');
const auth = new google.auth.GoogleAuth({
	keyFile: "credentials.json",
	scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const clients = auth.getClient();
const googleSheets = google.sheets({ version: "v4", auth: clients });
const spreadsheetId = "1JruH9prKK6uD0YLMilNUWqmuKlUf8Zr39IUtBRKZNBg";
const arraysort =require('array-sort')  


//main globals 
let post = {};
let points = [];
let sht 

function fread(worksheet, cell) {
try {
		post = {
			rd : worksheet[0],
			kls : worksheet[1],
			win : worksheet[2],
			pts : worksheet[3],
			team : worksheet[4],
			did :worksheet[5]
		}
		points.push(post);
		post = {};
	}catch(er) {
			console.log('');
	}
}


function selsheet(grp){
	if(grp == "groupa"){
		sht = "sheet1"
	}	
	else if(grp == "groupb"){
		sht = "sheet2"
	}
	else if(grp == "groupc"){
		sht = "sheet3"
	}
	else if(grp == "groupd"){
		sht = "sheet4"
	}
	else if(grp == "groupe"){
		sht = "sheet5"
	}
	else if(grp == "groupf"){
		sht = "sheet6"
	}
	else if(grp == "groupg"){
		sht = "sheet7"
	}
	else if(grp == "grouph"){
		sht = "sheet8"
	}
	return sht	
}


function updateit(ar , kl , wn , pts , ran){
	console.log("come check")
	googleSheets.spreadsheets.values.update({
		auth,
		spreadsheetId,
		range : ran,
		valueInputOption: 'USER_ENTERED',
		resource: {
			range : ran,
			majorDimension: 'ROWS',
			values: [[ar , kl , wn , pts]]}
	})
}



async function readit(gsht) {
	try{
		console.log("the val of ghst inside is : " + gsht)
		let shet = gsht + "!A:F"
		console.log("the val of shet is : "  + shet)
		const getRows = await googleSheets.spreadsheets.values.get({
			auth,
			spreadsheetId,
			range: shet,
		});
			points = [];
			for (let i = 0; i <= 10; i++)
				fread(getRows.data.values[i], i);
			return points;
	}catch(er){
		console.log(er)
	}
}

async function writeit(nvals,gsht){
	let shet = gsht + "!A:B"
	await googleSheets.spreadsheets.values.append({
		auth,
		spreadsheetId,
		range: shet,
		valueInputOption: "USER_ENTERED",
		resource: {
		  values: [nvals],
		},
	  });
	  console.log("write successfull")
	  return points;
}


//it is used for embeding the messages 
function embeds(title, des, color) {
	const exampleEmbed = new MessageEmbed()
		.setColor(`${color}`)
		.setTitle(`${title}`)
		.setDescription(`${des}`)
		.setTimestamp()
	return exampleEmbed;
}


//bot on  here 
client.on('ready', () => {
	console.log("bot online!!")
	client.user.setPresence({
		status: 'online',
		activity: {
			type: 'PLAYING',
			name: 'Created By Monk and Team  Contact: Monk#4158',
		},
	});
});



//used for variables 
let c = 0
//readit()

let tgroups = ['groupa','groupb','groupc','groupd','groupe','groupf','groupg','grouph']

//commands for the bot starts here 
client.on('message', async (msg) => {
	 if (msg.content.startsWith("*seeme")) {
		const args = msg.content.slice(prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();
		if (!args.length) {
			 msg.channel.send(embeds("Argument Error", `You didn't provide any arguments : ${msg.author.username}!`, "#d40407"));
			 return
		}
		if(tgroups.indexOf(args[0]) == -1){
			console.log("argument error ")
			msg.channel.send(embeds("Argument Error", `You didn't provide crt group : ${msg.author.username}!`, "#d40407"));
			return 
		}
		console.log("the val of grop is : " + args[0])
		let gsht = selsheet(args[0]) 
		readit(gsht).then(data => {
			let val = 0;
			let n = data.length
			console.log("the length of points is :" + n)
			for (c = 0; c <= n; c++) {
				console.log(`the val is ${data[c].did} , ${msg.author.id}`)
				if (data[c].did == msg.author.id) {
					console.log(`the pts is ${data[c].pts}`)
					val = c
					break;
				}
				else {
					val = 0
				}
			}
			console.log(`the val is ${val}`)
			if (val != 0) {
				msg.author.send(embeds("View points", ` ${msg.author.username} has ${data[val].pts} points `, "#09ff00"))
				msg.reply(embeds("View points", `${msg.author.username}plz check ur DM for points :`, "#09ff00"))
				console.log(` =====> ${msg.author.username} requested for points`);
			}
			else {
				msg.reply(embeds("View points", "user has no Account", "#e67000"));
				console.log(` =====> ${msg.author.username} requested for points`);
			}	
		}).catch(err => {
//			console.log(err);
			msg.reply(embeds("View points", "user has no Account", "#e67000"));
			console.log(` =====> ${msg.author.username} requested for points`);
		});
	 }
	 else  if (msg.content.startsWith('*open')) {
		const args = msg.content.slice(prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();
		if (!msg.member.roles.cache.has(`${perrol}`)) {
			msg.reply(embeds("account open", `don't have the permession to do that `, "#d40407"))
			console.log(`${msg.author.id} have tried to acess the higher commands ${msg.author.username.tag}`)
			return;
		}
		if (!args.length) {
			return msg.channel.send(embeds("Argument Error", `You didn't provide any arguments : ${msg.author.user}!`, "#d40407"));
		}
		if(tgroups.indexOf(args[3]) == -1){
			console.log("argument error ")
			msg.channel.send(embeds("Argument Error", `You didn't provide crt group : ${msg.author.username}!`, "#d40407"));
			return 
		}
		let gsht = selsheet(args[3]) 
		console.log("the val of sheet is  : " + gsht)
		readit(gsht);
		const taggedUser = msg.mentions.users.first();
		let id = taggedUser.id;
		let team = args[2]
		if(args[2] == '' || args[2] == undefined){
			console.log("Argument Error")
			msg.channel.send(embeds("Argument Error", `You didn't provide any arguments : ${msg.author.username}!`, "#d40407"));
			return
		}
		const valch = points.find(vala => vala.did == id)
		if (!valch) {
			console.log("the id is : " + id)
			rval = [0,0,0,0,team,id]
			writeit(rval,gsht)
			msg.reply(embeds("account open", `Account opened successfully for ${taggedUser.username}`, "#09ff00"))
			console.log(` ======> Account opend for  ${msg.author.username} and has `);
		}
		else {
			console.log("already reg  user ")
			msg.reply(embeds("account open", `User already exists : ${taggedUser.username}`, "#d40407"))
		}
	}

	else if (msg.content.startsWith(`${prefix}stands`)) {
		try{
			const args = msg.content.slice(prefix.length).trim().split(' ');
			const command = args.shift().toLowerCase();
			if(tgroups.indexOf(args[0]) == -1){
				console.log("argument error ")
				msg.channel.send(embeds("Argument Error", `You didn't provide crt group : ${msg.author.username}!`, "#d40407"));
				return 
			}
			console.log("the val of agrs  is  : " + args[0])
			let gsht = selsheet(args[0]) 
			console.log("the val of sheet is  : " + gsht)
			let tpts = await readit(gsht);
			console.log("the val of : " + tpts)
			console.log("the len of pts " + tpts.length)
			for(let k = 1 ; k < tpts.length ; k ++){
				tpts[k].pts = tpts[k].pts * 1
			}
			let spts = arraysort(tpts , 'pts' , {reverse : true})
			console.log("the sorted array is :" + spts) 
			let n = spts.length
			msg.reply(" here is the standings ")
			console.log("=================================")
			let printStr = '===================\n';
			for (c = 0; c < n; c++) {
				printStr += `| \t ${spts[c].rd} \t | \t ${spts[c].kls} \t | \t ${spts[c].win} \t | \t ${spts[c].pts}\t | \t ${spts[c].team} \t|\n================ \n`;
			}
			console.log(printStr);
			msg.channel.send(embeds("standings", printStr, "#A19882"))
	//		msg.channel.send(printStr)
	}catch(er){
			console.log(er);
		}
	}
	else if (msg.content.startsWith('*addto')) {
		const args = msg.content.slice(prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();
		if (!msg.member.roles.cache.has(`${perrol}`)) {
			msg.reply(embeds("account open", `don't have the permession to do that `, "#d40407"))
			console.log(`${msg.author.id} have tried to acess the higher commands ${msg.author.username.tag}`)
			return;
		}
		if (!args.length) {
			return msg.channel.send(embeds("Argument Error", `You didn't provide any arguments : ${msg.author}!`, "#d40407"));
		}
		if (!Number(args[2]) || !Number(args[3]) || !Number(args[4]) || !Number(args[5])) {
			msg.reply(embeds("command Error", `plz use the command correctly : ${msg.author.username}!`, "#d40407"));
			return;
		}
		if(tgroups.indexOf(args[6]) == -1){
			console.log("argument error ")
			msg.channel.send(embeds("Argument Error", `You didn't provide crt group : ${msg.author}!`, "#d40407"));
			return 
		}
		let gsht = selsheet(args[6]) 
		console.log("the val of sheet is  : " + gsht)
		readit(gsht).then( data=> {
		const taggedUser = msg.mentions.users.first();
		id = taggedUser.id;
		console.log("the value of of arg is : " + args[2]);
		let ap = args[5];
		let ar = args[2]
		let kl = args[3]
		let wn = args[4]
		let alen = data.length
		let ne = 0;
		for (let c = 1; c < alen; c++) {
			console.log("the val is : " + data[c].did)
			if (data[c].did === id) {
				let tot = (data[c].pts * 1) + (ap * 1)
				console.log(` tag user : ${data[c].did} and ${id} , val is ${ap} and tot is ${tot}`)
				data[c].pts = (tot * 1)
				data[c].rd  = ar
				data[c].kls = kl
				data[c].win = wn
				console.log("the val : " + c)
				console.log("the val of pts is : " + data[c].pts)
				let k = c+1
				let ran = gsht + "!A" + k +":D" + k
				updateit(ar , kl , wn , tot ,ran)
				ne = ne + 1;
			}
		}
		if(ne == 0 ){
			console.log("account error ")
			msg.channel.send(embeds("points", `No user found : ${taggedUser.username}!`, "#d40407"));
			return
		}
		else {	
			console.log(` =====> the user ${taggedUser.username} gets ` + ap + ' goes to ' + data.id);
			msg.reply(embeds("Points", `gave ${ap} to ${taggedUser.username}`, "#f47fff"));
		}
		})
	}
	else if( msg.content.startsWith('*')){
		msg.reply(embeds("command Error", `plz use the command correctly : ${msg.author.username}!`, "#d40407"));
		return
	}
});



let itoken = token;
client.login(itoken);
