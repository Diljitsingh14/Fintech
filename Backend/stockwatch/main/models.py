from django.db import models

# Create your models here.


class FII_DATA(models.Model):
    DJI_open = models.FloatField()
    DJI_high = models.FloatField()
    DJI_low = models.FloatField()
    DJI_close = models.FloatField()
    DJI_volume = models.FloatField()

    BTC_USD_open = models.FloatField()
    BTC_USD_high = models.FloatField()
    BTC_USD_low = models.FloatField()
    BTC_USD_close = models.FloatField()
    BTC_USD_volume = models.FloatField()

    ETH_USD_open = models.FloatField()
    ETH_USD_high = models.FloatField()
    ETH_USD_low = models.FloatField()
    ETH_USD_close = models.FloatField()
    ETH_USD_volume = models.FloatField()

    CL_F_open = models.FloatField()
    CL_F_high = models.FloatField()
    CL_F_low = models.FloatField()
    CL_F_close = models.FloatField()
    CL_F_volume = models.FloatField()

    GC_F_open = models.FloatField()
    GC_F_high = models.FloatField()
    GC_F_low = models.FloatField()
    GC_F_close = models.FloatField()
    GC_F_volume = models.FloatField()

    SI_F_open = models.FloatField()
    SI_F_high = models.FloatField()
    SI_F_low = models.FloatField()
    SI_F_close = models.FloatField()
    SI_F_volume = models.FloatField()

    NG_F_open = models.FloatField()
    NG_F_high = models.FloatField()
    NG_F_low = models.FloatField()
    NG_F_close = models.FloatField()
    NG_F_volume = models.FloatField()

    DX_Y_NYB_open = models.FloatField()
    DX_Y_NYB_high = models.FloatField()
    DX_Y_NYB_low = models.FloatField()
    DX_Y_NYB_close = models.FloatField()
    DX_Y_NYB_volume = models.FloatField()

    BSESN_open = models.FloatField()
    BSESN_high = models.FloatField()
    BSESN_low = models.FloatField()
    BSESN_close = models.FloatField()
    BSESN_volume = models.FloatField()

    NDX_open = models.FloatField()
    NDX_high = models.FloatField()
    NDX_low = models.FloatField()
    NDX_close = models.FloatField()
    NDX_volume = models.FloatField()

    GSPC_open = models.FloatField()
    GSPC_high = models.FloatField()
    GSPC_low = models.FloatField()
    GSPC_close = models.FloatField()
    GSPC_volume = models.FloatField()

    NSEI_open = models.FloatField()
    NSEI_high = models.FloatField()
    NSEI_low = models.FloatField()
    NSEI_close = models.FloatField()
    NSEI_volume = models.FloatField()

    date = models.DateField(default="2018-04-01")

    def __str__(self):
        open_prices = [
            f"DJI_open: {self.DJI_open}",
            f"BTC_USD_open: {self.BTC_USD_open}",
        ]
        return f"{self.date} - {' | '.join(open_prices)}"


class Article(models.Model):
    link = models.URLField(max_length=200, null=True, blank=True)
    title = models.CharField(max_length=200)
    date_time = models.DateTimeField()
    description = models.TextField()
    content = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title


class Checkpoint(models.Model):
    module = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    date_time = models.DateTimeField()

    def __str__(self):
        return self.module
