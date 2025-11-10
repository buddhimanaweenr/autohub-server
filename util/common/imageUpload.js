import decodeBase64Image from './decodeBase64Image';
import moment from 'moment';

const imageUpload = (image, dir, regNo) => {

    var imageTypeRegularExpression = /\/(.*?)$/; 
    
    var base64Data = image;
    
    var imageBuffer = decodeBase64Image(base64Data);
    var userUploadedFeedMessagesLocation = dir;
    
    var uniqueRandomImageName = regNo + "_" + moment().unix();
    // This variable is actually an array which has 5 values,
    // The [1] value is the real image extension
    var imageTypeDetected = imageBuffer
    .type
    .match(imageTypeRegularExpression);
    
    var userUploadedImagePath = userUploadedFeedMessagesLocation + 
    uniqueRandomImageName +
    '.' + 
    imageTypeDetected[1];
    
    // Save decoded binary image to disk
    try
    {
    require('fs').writeFile(userUploadedImagePath, imageBuffer.data, 
    function() 
    {
        console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
    });
    }
    catch(error)
    {
    console.log('ERROR:', error);
    }

    var imageName = uniqueRandomImageName +'.' + imageTypeDetected[1];
    return imageName;
}

export default imageUpload;