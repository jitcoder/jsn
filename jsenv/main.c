#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "types/JValue.h"


int main(int argc, char *argv[]){
  int x = 5;

  struct JValue *var = JValue_declareVariable("var");
  JValue_setIntegerValue(var, x);

  printf("Hello World, the value of x is %d", *(int *) var->mem);

  JValue_setStringValue(var, "Now I'm a string!'");
  printf("x is now: %s", (char *)var->mem);

  return 0;
}

