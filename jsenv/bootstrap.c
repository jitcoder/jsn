#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "types/JValue.h"
#include "error/trycatch.h"

void print(struct JValue *msg){
  switch(msg->inferredType){
    case INTEGER:
    case LONG:
      printf("%d", *(int *)msg->mem);
      break;
    case STRING:
      printf("%s", msg->mem);
      break;
    case DOUBLE:
      printf("%2f", *(double *)msg->mem);
      break;
    case FLOAT:
      printf("%f", *(float *)msg->mem);
      break;
    case BOOLEAN:
      if(*(char *)msg->mem == 1){
        printf("true");
        break;
      }
      printf("false");
      break;
    }
}

int main(int argc, char *argv[]){
  TRY
      //%%TAIL%%
      return 0;
  CATCH
    return 1;
  ETRY;
}
