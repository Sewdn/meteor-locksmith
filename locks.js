var Locks = new Mongo.Collection('locksmith_locks');

Locks._ensureIndex({ 'expires': 1 });
Locks._ensureIndex({ 'lock': 1 });

LockSmith = {
  lockTTL: 60
};

var unique;
Lock = function(raw) {
  _.extend(this, raw);
};
_.extend(Lock.prototype, {
  renew: function() {
    var now = new Date();
    Locks.update({_id: this._id}, {$set: {
      expires: new Date(now.getTime() + 1000*LockSmith.lockTTL),
      lock: unique
    }});
  },
  unlock: function() {
    Locks.update({_id: this._id}, {$unset: {lock: 1}});
  },
  isMine: function() {
    return this.lock === unique;
  }
});


_.extend(LockSmith, {
  once: function(key, cb) {
    var checkLock = function() {
      var lock = LockSmith.lock(key);
      if (lock && lock.isMine()) {
        cb();
        // keep lock
        Meteor.setInterval(function() {
          lock.renew();
        }, LockSmith.lockTTL * 999);
      } else {
        Meteor.setTimeout(checkLock, LockSmith.lockTTL * 1000);
      }
    }
    checkLock();
  },
  lock: function(key) {
    if(! unique) {
      unique = Random.id();
    }
    // check if lock is free
    var raw = Locks.findOne({_id: key, expires: {$lt: new Date()}}),
        lock;
    if(! raw) {
      try {
        var now = new Date(),
            expires = new Date(now.getTime() + 1000*LockSmith.lockTTL),
            raw = {_id: key, created: now, expires: expires, lock: unique};
        Locks.insert(raw);
        return new Lock(raw);
      } catch(e) {
        // lock exists and it is not free
        return null;
      }
    } else {
      // lock exists, but it is free
      // assign this lock
      lock = new Lock(raw);
      lock.renew();
      return lock;
    }
  }
});
