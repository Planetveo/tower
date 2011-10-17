(function() {
  var Base;
  Base = (function() {
    function Base(environment, path) {
      this.environment = environment;
      this.path = Metro.Support.File.expand_path(path);
    }
    Base.prototype.stat = function() {
      return Metro.Support.File.stat(this.path);
    };
    Base.prototype.content_type = function() {
      var _ref;
      return (_ref = this._content_type) != null ? _ref : this._content_type = Metro.Support.File.content_type(this.path);
    };
    Base.prototype.mtime = function() {
      var _ref;
      return (_ref = this._mtime) != null ? _ref : this._mtime = Metro.Support.File.stat(this.path).mtime;
    };
    Base.prototype.size = function() {
      var _ref;
      return (_ref = this._size) != null ? _ref : this._size = Metro.Support.File.stat(this.path).size;
    };
    Base.prototype.digest = function() {
      var _ref;
      return (_ref = this._digest) != null ? _ref : this._digest = Metro.Support.File.digest(this.path);
    };
    Base.prototype.digest_path = function() {
      return this.path_with_fingerprint(this.digest());
    };
    Base.prototype.extensions = function() {
      var _ref;
      return (_ref = this._extensions) != null ? _ref : this._extensions = Metro.Support.File.extensions(this.path);
    };
    Base.prototype.path_fingerprint = function() {
      var result;
      result = Metro.Support.File.basename(this.path).match(/-([0-9a-f]{32})\.?/);
      if (result != null) {
        return result[1];
      } else {
        return null;
      }
    };
    Base.prototype.path_with_fingerprint = function(digest) {
      var old_digest;
      if (old_digest = this.path_fingerprint()) {
        return this.path.replace(old_digest, digest);
      } else {
        return this.path.replace(/\.(\w+)$/, "-" + digest + ".\$1");
      }
    };
    Base.prototype.body = function() {
      return Metro.Support.File.read(this.path);
    };
    Base.prototype.write = function(to, options) {
      var _ref;
      if ((_ref = options.compress) == null) {
        options.compress = Metro.Support.File.extname(to) === '.gz';
      }
      if (options.compress) {
        fs.readFile(this.path, function(data) {
          return fs.writeFile("" + to + "+", data);
        });
      } else {
        Metro.Support.File.copy(this.path, "" + to + "+");
      }
      FileUtils.mv("" + filename + "+", filename);
      Metro.Support.File.utime(mtime, mtime, filename);
      return nil;
    };
    return Base;
  })();
  module.exports = Base;
}).call(this);