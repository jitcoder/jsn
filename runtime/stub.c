#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "types/JValue.h"
#include "error/trycatch.h"
#include "console/io.h"


int main(int argc, char *argv[]){
  TRY
      //%%TAIL%%
      return 0;
  CATCH
    return 1;
  ETRY;
}
