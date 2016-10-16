cmake_minimum_required(VERSION 2.8.9)
project (jsenv)
set(CMAKE_BUILD_TYPE Debug)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/jsenv/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/jsenv/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/jsenv/bin)
add_executable(app 
  jsenv/app.c
  jsenv/const.h
  jsenv/types/JValue.h
  jsenv/types/JValue.c
  jsenv/error/trycatch.h
  jsenv/error/trycatch.c
  jsenv/error/exception.h
)
