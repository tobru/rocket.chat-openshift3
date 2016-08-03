(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/deleteMessage.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  deleteMessage: function(message) {                                   // 2
    var blockDeleteInMinutes, currentTsDiff, deleteAllowed, deleteOwn, hasPermission, keepHistory, msgTs, originalMessage, ref, ref1, ref2, showDeletedStatus;
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'deleteMessage'                                        // 4
      });                                                              //
    }                                                                  //
    originalMessage = RocketChat.models.Messages.findOneById(message._id, {
      fields: {                                                        // 6
        u: 1,                                                          // 6
        rid: 1,                                                        // 6
        file: 1                                                        // 6
      }                                                                //
    });                                                                //
    if (originalMessage == null) {                                     // 7
      throw new Meteor.Error('error-action-not-allowed', 'Not allowed', {
        method: 'deleteMessage',                                       // 8
        action: 'Delete_message'                                       // 8
      });                                                              //
    }                                                                  //
    hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'delete-message', originalMessage.rid);
    deleteAllowed = RocketChat.settings.get('Message_AllowDeleting');  // 3
    deleteOwn = (originalMessage != null ? (ref = originalMessage.u) != null ? ref._id : void 0 : void 0) === Meteor.userId();
    if (!(hasPermission || (deleteAllowed && deleteOwn))) {            // 15
      throw new Meteor.Error('error-action-not-allowed', 'Not allowed', {
        method: 'deleteMessage',                                       // 16
        action: 'Delete_message'                                       // 16
      });                                                              //
    }                                                                  //
    blockDeleteInMinutes = RocketChat.settings.get('Message_AllowDeleting_BlockDeleteInMinutes');
    if ((blockDeleteInMinutes != null) && blockDeleteInMinutes !== 0) {
      if (originalMessage.ts != null) {                                // 20
        msgTs = moment(originalMessage.ts);                            // 20
      }                                                                //
      if (msgTs != null) {                                             // 21
        currentTsDiff = moment().diff(msgTs, 'minutes');               // 21
      }                                                                //
      if (currentTsDiff > blockDeleteInMinutes) {                      // 22
        throw new Meteor.Error('error-message-deleting-blocked', 'Message deleting is blocked', {
          method: 'deleteMessage'                                      // 23
        });                                                            //
      }                                                                //
    }                                                                  //
    keepHistory = RocketChat.settings.get('Message_KeepHistory');      // 3
    showDeletedStatus = RocketChat.settings.get('Message_ShowDeletedStatus');
    if (keepHistory) {                                                 // 29
      if (showDeletedStatus) {                                         // 30
        RocketChat.models.Messages.cloneAndSaveAsHistoryById(originalMessage._id);
      } else {                                                         //
        RocketChat.models.Messages.setHiddenById(originalMessage._id, true);
      }                                                                //
      if (((ref1 = originalMessage.file) != null ? ref1._id : void 0) != null) {
        RocketChat.models.Uploads.update(originalMessage.file._id, {   // 36
          $set: {                                                      // 36
            _hidden: true                                              // 36
          }                                                            //
        });                                                            //
      }                                                                //
    } else {                                                           //
      if (!showDeletedStatus) {                                        // 39
        RocketChat.models.Messages.removeById(originalMessage._id);    // 40
      }                                                                //
      if (((ref2 = originalMessage.file) != null ? ref2._id : void 0) != null) {
        FileUpload["delete"](originalMessage.file._id);                // 43
      }                                                                //
    }                                                                  //
    if (showDeletedStatus) {                                           // 45
      return RocketChat.models.Messages.setAsDeletedById(originalMessage._id);
    } else {                                                           //
      return RocketChat.Notifications.notifyRoom(originalMessage.rid, 'deleteMessage', {
        _id: originalMessage._id                                       // 48
      });                                                              //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=deleteMessage.coffee.js.map
