(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/fileUpload.coffee.js                                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var initFileStore;                                                     // 1
                                                                       //
if (typeof UploadFS !== "undefined" && UploadFS !== null) {            // 1
  RocketChat.models.Uploads.model.allow({                              // 2
    insert: function(userId, doc) {                                    // 3
      return userId;                                                   // 4
    },                                                                 //
    update: function(userId, doc) {                                    // 3
      return userId === doc.userId;                                    // 7
    },                                                                 //
    remove: function(userId, doc) {                                    // 3
      return userId === doc.userId;                                    // 10
    }                                                                  //
  });                                                                  //
  initFileStore = function() {                                         // 2
    var cookie;                                                        // 13
    cookie = new Cookies();                                            // 13
    if (Meteor.isClient) {                                             // 14
      document.cookie = 'rc_uid=' + escape(Meteor.userId()) + '; path=/';
      document.cookie = 'rc_token=' + escape(Accounts._storedLoginToken()) + '; path=/';
    }                                                                  //
    return Meteor.fileStore = new UploadFS.store.GridFS({              //
      collection: RocketChat.models.Uploads.model,                     // 19
      name: 'rocketchat_uploads',                                      // 19
      collectionName: 'rocketchat_uploads',                            // 19
      filter: new UploadFS.Filter({                                    // 19
        onCheck: FileUpload.validateFileUpload                         // 23
      }),                                                              //
      transformWrite: function(readStream, writeStream, fileId, file) {
        var identify, stream;                                          // 25
        if (RocketChatFile.enabled === false || !/^image\/.+/.test(file.type)) {
          return readStream.pipe(writeStream);                         // 26
        }                                                              //
        stream = void 0;                                               // 25
        identify = function(err, data) {                               // 25
          var ref;                                                     // 31
          if (err != null) {                                           // 31
            return stream.pipe(writeStream);                           // 32
          }                                                            //
          file.identify = {                                            // 31
            format: data.format,                                       // 35
            size: data.size                                            // 35
          };                                                           //
          if ((data.Orientation != null) && ((ref = data.Orientation) !== '' && ref !== 'Unknown' && ref !== 'Undefined')) {
            return RocketChatFile.gm(stream).autoOrient().stream().pipe(writeStream);
          } else {                                                     //
            return stream.pipe(writeStream);                           //
          }                                                            //
        };                                                             //
        return stream = RocketChatFile.gm(readStream).identify(identify).stream();
      },                                                               //
      onRead: function(fileId, file, req, res) {                       // 19
        var rawCookies, ref, token, uid;                               // 46
        if (RocketChat.settings.get('FileUpload_ProtectFiles')) {      // 46
          if ((req != null ? (ref = req.headers) != null ? ref.cookie : void 0 : void 0) != null) {
            rawCookies = req.headers.cookie;                           // 47
          }                                                            //
          if (rawCookies != null) {                                    // 48
            uid = cookie.get('rc_uid', rawCookies);                    // 48
          }                                                            //
          if (rawCookies != null) {                                    // 49
            token = cookie.get('rc_token', rawCookies);                // 49
          }                                                            //
          if (uid == null) {                                           // 51
            uid = req.query.rc_uid;                                    // 52
            token = req.query.rc_token;                                // 52
          }                                                            //
          if (!(uid && token && RocketChat.models.Users.findOneByIdAndLoginToken(uid, token))) {
            res.writeHead(403);                                        // 56
            return false;                                              // 57
          }                                                            //
        }                                                              //
        res.setHeader('content-disposition', "attachment; filename=\"" + (encodeURIComponent(file.name)) + "\"");
        return true;                                                   // 60
      }                                                                //
    });                                                                //
  };                                                                   //
  Meteor.startup(function() {                                          // 2
    if (Meteor.isServer) {                                             // 63
      return initFileStore();                                          //
    } else {                                                           //
      return Tracker.autorun(function(c) {                             //
        if (Meteor.userId() && RocketChat.settings.cachedCollection.ready.get()) {
          initFileStore();                                             // 68
          return c.stop();                                             //
        }                                                              //
      });                                                              //
    }                                                                  //
  });                                                                  //
}                                                                      //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=fileUpload.coffee.js.map
