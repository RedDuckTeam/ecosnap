if [ "$BUILD_APP" = "api" ]; 
        then yarn build:api; 
    else if [ "$BUILD_APP" = "submitter" ]; 
        then yarn build:submitter; 
    else echo invalid env detected, please set BUILD_APP; 
fi