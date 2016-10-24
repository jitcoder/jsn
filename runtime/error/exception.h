#ifndef EXCEPTION_H
#define EXCEPTION_H

#include "../types/JValue.h"

struct exception {
  struct JValue *message;
};

#endif