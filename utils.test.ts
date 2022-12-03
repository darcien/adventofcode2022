import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { getFileName } from "./utils.ts";

Deno.test("getFileName should return the file name with ext by default", () => {
  const path = "file:///foo/bar/baz/woo.hoo.ts";
  const fileName = getFileName(path);

  assertEquals(fileName, "woo.hoo.ts");
});

Deno.test(
  "getFileName should trim the ext from file name when trimExt=true",
  () => {
    const path = "file:///foo/bar/baz/yaa.baa.ts";
    const fileName = getFileName(path, { trimExt: true });

    assertEquals(fileName, "yaa.baa");
  }
);
