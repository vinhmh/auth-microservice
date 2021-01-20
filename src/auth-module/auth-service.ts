import { Injectable } from '@nestjs/common';
import { Buffer } from 'buffer';
import { inflateRaw } from 'pako';
const phpunserialize = require('phpunserialize');
const atob = require('atob')
const sha1 = require('sha1')
@Injectable()
export class AuthService {
  decodetoken(ctoken: string, puk: string | any[]): {} {
    console.log("hearingForm Decode")
    if (ctoken.length == 0 || puk.length == 0) return null;
    const rawurldecode = unescape(ctoken.replace('%20', ' '));
    var b64: string = atob(rawurldecode);
    var sDec = [];
    for (var i = 0; i < b64.length; i++) {
      sDec.push(b64.charCodeAt(i));
    } //base64 decodeString to byte array (unit8Array)
    var buf = inflateRaw(sDec); //decompress byte array

    var token = String.fromCharCode.apply(String, buf);
    var sgn = token.slice(token.length - 40);
    var arr = token.slice(0, token.length - 40);
    var tohash = puk + '::=' + arr + '::=' + '1';
    var validate = sha1(tohash);
    if (validate == sgn) {
      let parse_json = new Buffer(arr, 'hex').toString(); // hex to jsonString
      let strJson = parse_json.replace('\u0000', ' ');
      const object_User = phpunserialize(strJson); //json to object
      let user = {};
      for (let [key, value] of Object.entries(object_User)) {
        let new_key = key.replace('\x00', '').trim();
        user[new_key] = value;
      }
      user['token'] = ctoken; // add token to object
      user['puk'] = puk;
      return user;
    } else return null;
  }
  getUser() {
    console.log("hearing from getUser")
    let token =
      'jVJZlsMgDLsSeJHhOFng%2FkcYQTJJOtP32vSjgGXJlm1dF838LSKWXS2swuBoYahhUUUmQnWJNXSeMdApvcen5B18Y96KSrwQDx2fa9GDIw4GWVIKD%2F%2BILzceGzqCGW1k3FEIegjZDF2r1iuayXirUY%2FIjflqKzxunB44mCYtANWzGm%2FK%2F4rMFwE%2FnaeB4asRmYkkAT3IZMbFJ4erZ9UeJRIdEuThFHtoZvPs877DHxXbyJwq1J4dCOtIQ4e6rPCBrY%2FudHqpmDPxk5evVMIe6YOC8zZ6i7ERD6z%2BcV%2FJtpmTO1Nh%2B3oO9uBh9Mxvb5jOjQz6RNd%2Bo43KzHrVuzo%2F3bz2KJ%2Bo%2BpzCy16%2F4h47SSYZ8xwYa%2F95AqyokUdRLp70pip6Qcc4gavmNKLztpcEqqJstbSVLvfmvUu10bNte%2Bul5fDefgA%3D';
    let puk = 'd08f514d319af2ff1f2089d8a573eabf';
    return this.decodetoken(token, puk);
  }
}
