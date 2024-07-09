function a() {
  console.log("a");
  return function b() {
    console.log("b");
  };
}

a()();
