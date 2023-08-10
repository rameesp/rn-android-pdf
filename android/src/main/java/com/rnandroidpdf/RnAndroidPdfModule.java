package com.rnandroidpdf;

import androidx.annotation.NonNull;

import com.facebook.react.module.annotations.ReactModule;
import android.widget.Toast;
import android.net.Uri;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.pdf.PdfRenderer;
import android.os.ParcelFileDescriptor;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import android.os.ParcelFileDescriptor;
import java.io.File;
import java.io.FileOutputStream;
import java.io.File;
import android.widget.Toast;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.graphics.BitmapFactory;
import java.io.ByteArrayOutputStream;

@ReactModule(name = RnAndroidPdfModule.NAME)
public class RnAndroidPdfModule extends ReactContextBaseJavaModule {
    public static final String NAME = "RnAndroidPdf";
    private static final String E_CONVERT_ERROR = "E_CONVERT_ERROR";
    private final ReactApplicationContext reactContext;
    private File file;
    private ParcelFileDescriptor mFileDescriptor;
    private PdfRenderer mPdfRenderer;
    private int mTotalPageCount;

    public RnAndroidPdfModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void initRenderer(String pdfUriString, Promise promise) {
        WritableMap map = Arguments.createMap();
        try {
            if (pdfUriString == null || pdfUriString.isEmpty()) {
                promise.reject("Empty url");
                return;
            }
            file = new File(pdfUriString.replace("file://", ""));
            mFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
            mPdfRenderer = new PdfRenderer(mFileDescriptor);
            mTotalPageCount = mPdfRenderer.getPageCount();
            map.putString("total_pages", mTotalPageCount + "");
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(E_CONVERT_ERROR, e);
            // TODO: handle exception
        }

    }

    @ReactMethod
    public void closeRenderer() {
        try {
            mPdfRenderer.close();

        } catch (Exception e) {
            // TODO: handle exception
        }
    }

    /**
     * 
     * @param pdfUriString downloaded path of PDF
     * @param promise      native module promise
     */
    @ReactMethod
    public void convertSingleItem(Integer index, Promise promise) {
        try {

            WritableMap map = Arguments.createMap();
            PdfRenderer.Page page = mPdfRenderer.openPage(index);

            Bitmap bitmap = Bitmap.createBitmap(page.getWidth(), page.getHeight(), Bitmap.Config.ARGB_8888);

            page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
            page.close();
            String bs64 = BitMapToString(bitmap);
            map.putString("page", index + "");
            map.putString("bmp", bs64);
            map.putString("width", page.getWidth() + "");
            map.putString("height", page.getHeight() + "");
            map.putString("total_pages", mTotalPageCount + "");

            promise.resolve(map);

            // renderer.close();

        } catch (Exception e) {
            promise.reject(E_CONVERT_ERROR, e);
        }
    }

    public String BitMapToString(Bitmap bitmap) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
        byte[] b = baos.toByteArray();
        String temp = Base64.encodeToString(b, Base64.DEFAULT);
        return temp;
    }

}
