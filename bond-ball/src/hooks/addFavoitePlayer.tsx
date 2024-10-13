import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";


type addFavorite<T> = {
  data: T | null;

};