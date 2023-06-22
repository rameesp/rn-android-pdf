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
    private ParcelFileDescriptor mFileDescriptor;
  public RnAndroidPdfModule(ReactApplicationContext reactContext) {
    super(reactContext);
     this.reactContext = reactContext;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

    /**
     * 
     * @param pdfUriString downloaded path of PDF
     * @param promise      native module promise
     */
    @ReactMethod
    public void convert(String pdfUriString, Integer size, Integer skip, Promise promise) {
        try {
            if (size == 0) {
                deleteCache();// clearing the cache before rendering new items so the storage
            }
            WritableMap map = Arguments.createMap();
            WritableArray files = Arguments.createArray();

            if (pdfUriString == null || pdfUriString.isEmpty())
                return;
            File file = new File(pdfUriString.replace("file://", ""));

            mFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);

            PdfRenderer renderer = new PdfRenderer(mFileDescriptor);
            final int pageCount = renderer.getPageCount();
            if (size + 10 > pageCount) {
                skip = pageCount - size;
            }

            for (int i = 0; i < skip; i++) {
                PdfRenderer.Page page = renderer.openPage(size + i);

                Bitmap bitmap = Bitmap.createBitmap(page.getWidth(), page.getHeight(), Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(bitmap);
                canvas.drawColor(Color.WHITE);

                page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
                File output = this.saveImage(bitmap, reactContext.getCacheDir());
                page.close();

                files.pushString(output.getAbsolutePath());
            }

            map.putArray("outputFiles", files);

            promise.resolve(map);

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
            Toast.makeText(reactContext, "deleted", Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            Toast.makeText(reactContext, "error in deleted", Toast.LENGTH_LONG).show();
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
