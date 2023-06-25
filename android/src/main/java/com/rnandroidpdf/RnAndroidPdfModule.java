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

@ReactModule(name = RnAndroidPdfModule.NAME)
public class RnAndroidPdfModule extends ReactContextBaseJavaModule {
    public static final String NAME = "RnAndroidPdf";
    private static final String E_CONVERT_ERROR = "E_CONVERT_ERROR";
    private final ReactApplicationContext reactContext;
    private File file;

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
        try {
            deleteCache();// clearing the cache before rendering new items so the storage
            if (pdfUriString == null || pdfUriString.isEmpty()) {
                promise.reject("Empty url");
                return;
            }
            file = new File(pdfUriString.replace("file://", ""));

            promise.resolve("initiated");
        } catch (Exception e) {
            promise.reject(E_CONVERT_ERROR, e);
            // TODO: handle exception
        }

    }

    /**
     * 
     * @param pdfUriString downloaded path of PDF
     * @param promise      native module promise
     */
    @ReactMethod
    public void convert(Integer size, Integer skip, Promise promise) {
        try {
            WritableArray files = Arguments.createArray();
            ParcelFileDescriptor mFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
            PdfRenderer renderer = new PdfRenderer(mFileDescriptor);
            final int totalPageCount = renderer.getPageCount();
            if (size + 10 > totalPageCount) {
                skip = totalPageCount - size;
            }

            for (int i = 0; i < skip; i++) {
                WritableMap map = Arguments.createMap();
                PdfRenderer.Page page = renderer.openPage(size + i);

                Bitmap bitmap = Bitmap.createBitmap(page.getWidth(), page.getHeight(), Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(bitmap);
                canvas.drawColor(Color.WHITE);

                page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
                File output = this.saveImage(bitmap, reactContext.getCacheDir());
                page.close();
                map.putString("page", (size + 1) + i + "");
                map.putString("width", page.getWidth() + "");
                map.putString("height", page.getHeight() + "");
                map.putString("path", output.getAbsolutePath());
                map.putString("total_pages", totalPageCount + "");
                files.pushMap(map);
            }

            promise.resolve(files);

            renderer.close();

        } catch (Exception e) {
            promise.reject(E_CONVERT_ERROR, e);
        }
    }

    /**
     * after creating the bitmap it will save the file to cache directory
     * 
     * @return saved file path
     */
    private File saveImage(Bitmap finalBitmap, File cacheDir) {
        File file = new File(cacheDir.getAbsolutePath() + File.separator + System.currentTimeMillis() + "_pdf.png");
        if (file.exists())
            file.delete();
        try {
            FileOutputStream out = new FileOutputStream(file);
            finalBitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return file;
    }

    // to clear the cache before rendering new pdf
    private void deleteCache() {
        try {
            File dir = reactContext.getCacheDir();
            deleteDir(dir);

        } catch (Exception e) {

        }
    }

    // it will delete each files in the cache dir
    private static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
            return dir.delete();
        } else if (dir != null && dir.isFile()) {
            return dir.delete();
        } else {
            return false;
        }
    }
}
