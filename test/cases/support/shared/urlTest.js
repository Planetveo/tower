describe('Tower.SupportUrl', function() {
  var urlFor, url;

  urlFor = Tower.urlFor;

  afterEach(function() {
    Tower.defaultURLOptions = undefined;
  });

  test('urlFor("something")', function() {
    url = urlFor("something");
    assert.equal(url, "/something");
  });

  test('urlFor("/something")', function() {
    url = urlFor("/something");
    assert.equal(url, "/something");
  });

  test('urlFor("/something", action: "new")', function() {
    url = urlFor("/something", {action: "new"});
    assert.equal(url, "/something/new");
  });

  test('urlFor("/something/longer")', function() {
    url = urlFor("/something/longer");
    assert.equal(url, "/something/longer");
  });

  test('urlFor(controller: "custom", action: "new")', function() {
    url = urlFor({controller: "custom", action: "new"});
    assert.equal(url, "/custom/new");
  });

  test('urlFor(App.User)', function() {
    url = urlFor(App.User);
    assert.equal(url, "/users");
  });

  test('urlFor(post, App.Comment)', function() {
    var post, url;
    post = App.Post.build();
    post.set('id', 10);
    url = urlFor(post, App.Comment);
    assert.equal(url, "/posts/10/comments");
  });

  test('urlFor(post, comment)', function() {
    var comment, post, url;
    post = App.Post.build();
    post.set('id', 10);
    comment = App.Comment.build();
    comment.set('id', 20);
    url = urlFor(post, comment);
    assert.equal(url, "/posts/10/comments/20");
  });

  test('urlFor("admin", post, comment)', function() {
    var comment, post, url;
    post = App.Post.build();
    post.set('id', 10);
    comment = App.Comment.build();
    comment.set('id', 20);
    url = urlFor("admin", post, comment);
    assert.equal(url, "/admin/posts/10/comments/20");
  });

  test('urlFor(post, comment, action: "edit")', function() {
    var comment, post, url;
    post = App.Post.build();
    post.set('id', 10);
    comment = App.Comment.build();
    comment.set('id', 20);
    url = urlFor(post, comment, {
      action: "edit"
    });
    assert.equal(url, "/posts/10/comments/20/edit");
  });

  describe('named routes', function() {

    test('find route', function() {
      var route;
      route = Tower.Route.find('login');
      assert.equal(route.name, 'login');
    });

    test('urlFor(route: "login")', function() {
      url = urlFor({
        route: 'login'
      });
      assert.equal(url, "/sign-in");
    });
  });

  describe('urlFor with params', function() {
    var post;
    post = null;
    beforeEach(function() {
      post = App.Post.build();
      return post.set('id', 10);
    });

    describe('strings', function() {

      test('urlFor(post, params: title: "Node")', function() {
        url = urlFor(post, {
          params: {
            title: "Node"
          }
        });
        assert.equal(url, "/posts/10?title=Node");
      });

      test('urlFor(post, params: title: /^a-z/)', function() {
        url = urlFor(post, {
          params: {
            title: /^a-z/
          }
        });
        assert.equal(url, "/posts/10?title=/^a-z/");
      });
    });

    describe('numbers', function() {

      test('urlFor(post, params: likes: 10)', function() {
        url = urlFor(post, {
          params: {
            likes: 10
          }
        });
        assert.equal(url, "/posts/10?likes=10");
      });

      test('urlFor(post, params: likes: ">=": 10)', function() {
        url = urlFor(post, {
          params: {
            likes: {
              '>=': 10
            }
          }
        });
        assert.equal(url, "/posts/10?likes=10..n");
      });

      test('urlFor(post, params: likes: "<=": 20)', function() {
        url = urlFor(post, {
          params: {
            likes: {
              '<=': 20
            }
          }
        });
        assert.equal(url, "/posts/10?likes=n..20");
      });

      test('urlFor(post, params: likes: ">=": 10, "<=": 20)', function() {
        url = urlFor(post, {
          params: {
            likes: {
              '>=': 10,
              '<=': 20
            }
          }
        });
        assert.equal(url, "/posts/10?likes=10..20");
      });
    });

    describe('dates', function() {

      test('urlFor(post, params: createdAt: _("Dec 25, 2011").toDate())', function() {
        url = urlFor(post, {
          params: {
            createdAt: _("Dec 25, 2011").toDate()
          }
        });
        assert.equal(url, "/posts/10?createdAt=2011-12-25");
      });

      test('urlFor(post, params: createdAt: ">=": _("Dec 25, 2011").toDate())', function() {
        url = urlFor(post, {
          params: {
            createdAt: {
              '>=': _("Dec 25, 2011").toDate()
            }
          }
        });
        assert.equal(url, "/posts/10?createdAt=2011-12-25..t");
      });

      test('urlFor(post, params: createdAt: "<=": _("Dec 25, 2011").toDate())', function() {
        url = urlFor(post, {
          params: {
            createdAt: {
              '<=': _("Dec 25, 2011").toDate()
            }
          }
        });
        assert.equal(url, "/posts/10?createdAt=t..2011-12-25");
      });

      test('urlFor(post, params: createdAt: ">=": _("Dec 25, 2011").toDate(), "<=": _("Dec 25, 2012").toDate())', function() {
        url = urlFor(post, {
          params: {
            createdAt: {
              '>=': _("Dec 25, 2011").toDate(),
              '<=': _("Dec 25, 2012").toDate()
            }
          }
        });
        assert.equal(url, "/posts/10?createdAt=2011-12-25..2012-12-25");
      });
    });

    test('date, number, and string', function() {
      var params, url;
      params = {
        createdAt: {
          '>=': _("Dec 25, 2011").toDate(),
          '<=': _("Dec 25, 2012").toDate()
        },
        likes: {
          '>=': 10,
          '<=': 20
        },
        title: "Node"
      };
      url = urlFor(post, {
        params: params
      });
      assert.equal(url, "/posts/10?createdAt=2011-12-25..2012-12-25&likes=10..20&title=Node");
    });
  });

  test('trailing slash');

  test('defaultURLOptions', function() {
    Tower.defaultURLOptions = {
      host: 'example.com'
    };
    assert.equal(urlFor(App.Post), 'http://example.com/posts');
  });
});
