import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';

import { IMAGES_URL } from 'config/config';

function ImageUploader(props) {
  const { t } = useTranslation();
  const [previewImage, setPreviewImage]= useState(null);

  const {
    fieldId,
    onChange,
    logo,
  } = props;

  const reader = useMemo(() => {
    const readerInstance = new FileReader()

    readerInstance.addEventListener('load', function () {
      const { result } = reader;
  
      setPreviewImage(result);
    }, false);

    return readerInstance;
  }, []);

  const handleChange = async (event) => {
    const { files } = event.target;
    const [file] = files;
  
    if (file) {
      reader.readAsDataURL(file);
    }

    onChange(file);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center">
          {previewImage && (
            <img
              src={previewImage}
              className="preview-image"
              alt=""
            />
          )}

          {logo && !previewImage && (
            <img src={`${IMAGES_URL}/h180/${logo}`} alt="" />
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <FormLabel htmlFor={fieldId}>
            <Button variant="contained" color="primary" component="span">{t('global.chooseImageToUpload')}</Button>
            <input
              type="file"
              accept="image/*"
              id={fieldId}
              onChange={handleChange}
              className="hide"
            />
          </FormLabel>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ImageUploader;
