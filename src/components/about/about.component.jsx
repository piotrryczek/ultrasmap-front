import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useTabStyles } from 'theme/useStyles';

function About(props) {
  const { handleClose } = props;
  const { t } = useTranslation();
  const tabClasses = useTabStyles({});

  const [currentPage, setCurrentPage] = useState('about');
  
  const handleChange = useCallback((event, newValue) => {
    setCurrentPage(newValue);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" justifyItems="center">
          <Tabs
            value={currentPage}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            className={tabClasses.root}
          >
            <Tab label={t('about.about')} value="about" />
            <Tab label={t('about.faq')} value="faq" />
          </Tabs>
        </Box>
      </Grid>

      {currentPage === 'about' && (
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom align="center">{t('welcome.header')}</Typography>
          <Typography gutterBottom>{t('welcome.paragraph1')}</Typography>
          <Typography gutterBottom>{t('welcome.paragraph2')}</Typography>
          <Typography gutterBottom>{t('welcome.paragraph3')}</Typography>
          <Typography gutterBottom>{t('welcome.paragraph4')}</Typography>
        </Grid>
      )}

      {currentPage === 'faq' && (
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom align="center">{t('faq.header')}</Typography>
          <Typography variant="h6">{t('faq.question1')}</Typography>
          <Typography gutterBottom>{t('faq.answer1')}</Typography>
          <Typography variant="h6">{t('faq.question2')}</Typography>
          <Typography gutterBottom>{t('faq.answer2')}</Typography>
          <Typography variant="h6">{t('faq.question3')}</Typography>
          <Typography gutterBottom>{t('faq.answer3')}</Typography>
          <Typography variant="h6">{t('faq.question4')}</Typography>
          <Typography gutterBottom>{t('faq.answer4')}</Typography>
          <Typography variant="h6">{t('faq.question5')}</Typography>
          <Typography gutterBottom>{t('faq.answer5')}</Typography>
          <Typography variant="h6">{t('faq.question6')}</Typography>
          <Typography gutterBottom>{t('faq.answer6')}</Typography>
        </Grid>
      )}



      <Grid item xs={12}>
        <Typography variant="caption">
          {t('welcome.copyrights')}
          <span className="copyright-email"><a href="mailto:fanaticsmap@gmail.com">fanaticsmap@gmail.com</a></span>
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleClose}
          >
            {t('global.backToMap')}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default About;
