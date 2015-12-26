/**
 * HTML5 file API wrapper module
 */
define(function () {
    return function () {
        var _self = this;

        _self.onInitFileSystem = function (fs) {
            _self.fs = fs;
        };

        _self.errorHandler = function (e) {
            console.log(e);
        };

        _self.dump = function (contents) {
            _self.fs.root.getFile('log.txt', {create: true}, function (fileEntry) {
                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        console.log('Write completed.');
                    };
                    fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                    };

                    // Create a new Blob and write it to log.txt.
                    var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
                    fileWriter.write(blob);

              }, _self.errorHandler);

            }, _self.errorHandler);
        }
        
        _self.read = function (filename, onRead) {
            _self.fs.root.getFile('log.txt', {}, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();

                    reader.onloadend = function(e) {
                        onRead(this.result);
                    };

                    reader.readAsText(file);
                }, _self.errorHandler);
            }, _self.errorHandler);
        };

        window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(PERSISTENT, grantedBytes, _self.onInitFileSystem, _self.errorHandler);
        }, function(e) {
            console.log('Error', e);
        });

        return this;
    }
});
