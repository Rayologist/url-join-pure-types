import { UrlJoin } from "../src";

describe("url join", () => {
  it("should work for simple case", () => {
    const url: UrlJoin<["http://www.google.com/", "foo/bar", "?test=123"]> =
      "http://www.google.com/foo/bar?test=123";
  });

  it("should work for simple case with new syntax", () => {
    const url: UrlJoin<["http://www.google.com/", "foo/bar", "?test=123"]> =
      "http://www.google.com/foo/bar?test=123";
  });

  it("should work for hashbang urls", () => {
    const url: UrlJoin<
      ["http://www.google.com/", "#!", "foo/bar", "?test=123"]
    > = "http://www.google.com/#!/foo/bar?test=123";
  });

  it("should be able to join protocol", () => {
    const url: UrlJoin<["http:", "www.google.com/", "foo/bar", "?test=123"]> =
      "http://www.google.com/foo/bar?test=123";
  });

  it("should be able to join protocol with slashes", () => {
    const url: UrlJoin<["http://", "www.google.com/", "foo/bar", "?test=123"]> =
      "http://www.google.com/foo/bar?test=123";
  });

  it("should remove extra slashes", () => {
    const url: UrlJoin<["http:", "www.google.com///", "foo/bar", "?test=123"]> =
      "http://www.google.com/foo/bar?test=123";
  });

  it("should not remove extra slashes in an encoded URL", () => {
    const url: UrlJoin<
      ["http:", "www.google.com///", "foo/bar", "?url=http%3A//Ftest.com"]
    > = "http://www.google.com/foo/bar?url=http%3A//Ftest.com";

    const url2: UrlJoin<["http://a.com/23d04b3/", "/b/c.html"]> =
      "http://a.com/23d04b3/b/c.html";
  });

  it("should support anchors in urls", () => {
    const url: UrlJoin<
      ["http:", "www.google.com///", "foo/bar", "?test=123", "#faaaaa"]
    > = "http://www.google.com/foo/bar?test=123#faaaaa";
  });

  it("should support protocol-relative urls", () => {
    const url: UrlJoin<["//www.google.com", "foo/bar", "?test=123"]> =
      "//www.google.com/foo/bar?test=123";
  });

  it("should support file protocol urls", () => {
    const url: UrlJoin<["file:/", "android_asset", "foo/bar"]> =
      "file://android_asset/foo/bar";

    const url2: UrlJoin<["file:", "/android_asset", "foo/bar"]> =
      "file://android_asset/foo/bar";
  });

  it("should support absolute file protocol urls", () => {
    const url: UrlJoin<["file:", "///android_asset", "foo/bar"]> =
      "file:///android_asset/foo/bar";

    const url2: UrlJoin<["file:///", "android_asset", "foo/bar"]> =
      "file:///android_asset/foo/bar";

    const url3: UrlJoin<["file:///", "//android_asset", "foo/bar"]> =
      "file:///android_asset/foo/bar";

    const url4: UrlJoin<["file:///android_asset", "foo/bar"]> =
      "file:///android_asset/foo/bar";
  });

  it("should merge multiple query params properly", () => {
    const url: UrlJoin<
      ["http:", "www.google.com///", "foo/bar", "?test=123", "?key=456"]
    > = "http://www.google.com/foo/bar?test=123&key=456";

    const url2: UrlJoin<
      [
        "http:",
        "www.google.com///",
        "foo/bar",
        "?test=123",
        "?boom=value",
        "&key=456"
      ]
    > = "http://www.google.com/foo/bar?test=123&boom=value&key=456";

    const url3: UrlJoin<
      ["http://example.org/x", "?a=1", "?b=2", "?c=3", "?d=4"]
    > = "http://example.org/x?a=1&b=2&c=3&d=4";
  });

  it("should merge slashes in paths correctly", () => {
    const url: UrlJoin<["http://example.org", "a//", "b//", "A//", "B//"]> =
      "http://example.org/a/b/A/B/";
  });

  it("should merge colons in paths correctly", () => {
    const url: UrlJoin<["http://example.org/", ":foo:", "bar"]> =
      "http://example.org/:foo:/bar";
  });

  it("should merge just a simple path without URL correctly", () => {
    const url: UrlJoin<["/", "test"]> = "/test";
  });

  //  ----------------------- ensured by typescript -----------------------
  //   it("should fail with segments that are not string", () => {
  //     assert.throws(() => urlJoin(true), /Url must be a string. Received true/);
  //     assert.throws(
  //       () => urlJoin("http://blabla.com/", 1),
  //       /Url must be a string. Received 1/
  //     );
  //     assert.throws(
  //       () => urlJoin("http://blabla.com/", undefined, "test"),
  //       /Url must be a string. Received undefined/
  //     );
  //     assert.throws(
  //       () => urlJoin("http://blabla.com/", null, "test"),
  //       /Url must be a string. Received null/
  //     );
  //     assert.throws(
  //       () => urlJoin("http://blabla.com/", { foo: 123 }, "test"),
  //       /Url must be a string. Received \[object Object\]/
  //     );
  //   });
  //  ----------------------------------------------------------------------

  it("should merge a path with colon properly", () => {
    const url: UrlJoin<["/users/:userId", "/cars/:carId"]> =
      "/users/:userId/cars/:carId";
  });

  it("should merge slashes in protocol correctly", () => {
    const url: UrlJoin<["http://example.org", "a"]> = "http://example.org/a";

    const url2: UrlJoin<["http:", "//example.org", "a"]> =
      "http://example.org/a";

    const url3: UrlJoin<["http:///example.org", "a"]> = "http://example.org/a";

    const url4: UrlJoin<["file:///example.org", "a"]> = "file:///example.org/a";

    const url5: UrlJoin<["file:example.org", "a"]> = "file://example.org/a";

    const url6: UrlJoin<["file:/", "example.org", "a"]> =
      "file://example.org/a";

    const url7: UrlJoin<["file:", "/example.org", "a"]> =
      "file://example.org/a";

    const url8: UrlJoin<["file:", "//example.org", "a"]> =
      "file://example.org/a";
  });

  it("should skip empty strings", () => {
    const url: UrlJoin<["http://foobar.com", "", "test"]> =
      "http://foobar.com/test";

    const url2: UrlJoin<["", "http://foobar.com", "", "test"]> =
      "http://foobar.com/test";
  });

  it("should return an empty string if no arguments are supplied", () => {
    const url: UrlJoin<[]> = "";
  });

  //   it("should not mutate the original reference", () => {
  //     const input = ["http:", "www.google.com/", "foo/bar", "?test=123"];
  //     const expected = Array.from(input);

  //     urlJoin(input);

  //     input.should.eql(expected);
  //   });

  // --------------------------------- tests from original repo ---------------------------------

  it("should have the same edge cases as url-join output", () => {
    const url: UrlJoin<["https://", "??", "?test=mock"]> =
      "https:/?&&test=mock";
    const url2: UrlJoin<["file:", "//", "?test=mock"]> = "file:?test=mock";
    const url3: UrlJoin<["file:", "///", "test"]> = "file:/test";
    const url4: UrlJoin<["file://", "///test"]> = "file:///test";
    const url5: UrlJoin<["file:/", "/test"]> = "file://test";
    const url6: UrlJoin<["file:/", "//test"]> = "file:///test";
  });
});
