from flask import Flask, render_template,request, jsonify
import json
import re

app = Flask(__name__)

#encryption function
def encrypt(myStr,point):
        encrypted=""
        for i in myStr:#find the encrypted version of every char
            if(ord(i)>96 and ord(i)<123):#for lowercase
                encrypted=encrypted+chr((ord(i)+point-97)%26+97)
            elif(ord(i)>64 and ord(i)<91):#for lowercase
                encrypted=encrypted+chr((ord(i)+point-64)%26+64)
            else: #if not a char in alphabet, then take the same value
                encrypted=encrypted+i
        return encrypted

#uncryption function
def unencrypt(myStr,point):
        unencrypted=""
        for i in myStr:#find the unencrypted version of every char
            if(ord(i)>96 and ord(i)<123):#for uppercase
                unencrypted=unencrypted+chr((ord(i)-point-97)%26+97)
            elif(ord(i)>64 and ord(i)<91):#for lowercase
                unencrypted=unencrypted+chr((ord(i)-point-64)%26+64)
            else:#if not a char in alphabet, then take the same value
                unencrypted=unencrypted+i
        return unencrypted

#handling get and post requests
@app.route("/", methods=['GET','POST'])
def home():
    if request.method == 'POST':#post includes a json message
        myInput=json.loads(request.data)
        result=str(myInput["message"]) #text field
        rotation=int(myInput["rot"]) #rotation number
        func=str(myInput["func"]) #operation type(encryption or decryption)
        if(func=="encrypt"):#if operation is encrypt
            result=encrypt(result,rotation)
        else:  #if operation is decrypt
            result=unencrypt(result,rotation)
        return jsonify(str=result)#return the jsonified result with only string attribute
     
    return  render_template("CeaserChiper.html")#if get method, renter the CeaserChiper html

if(__name__=="__main__"):#run configurations, from localhost:5050, 
    app.run(host="127.0.0.1",port=5050,debug=True)
