(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v039.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
RocketChat.Migrations.add({                                            // 1
	version: 39,                                                          // 2
	up: function () {                                                     // 3
		if (RocketChat && RocketChat.models && RocketChat.models.Settings) {
			var footer = RocketChat.models.Settings.findOne({ _id: 'Layout_Sidenav_Footer' });
                                                                       //
			// Replace footer octicons with icons                               //
			if (footer && footer.value !== '') {                                // 8
				var footerValue = footer.value.replace('octicon octicon-pencil', 'icon-pencil');
				footerValue = footerValue.replace('octicon octicon-heart', 'icon-heart');
				footerValue = footerValue.replace('octicon octicon-mark-github', 'icon-github-circled');
				RocketChat.models.Settings.update({ _id: 'Layout_Sidenav_Footer' }, { $set: { value: footerValue, packageValue: footerValue } });
			}                                                                   //
		}                                                                    //
	}                                                                     //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v039.js.map
