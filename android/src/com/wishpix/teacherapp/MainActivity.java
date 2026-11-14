package com.wishpix.teacherapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final String PREFS_NAME = "WishPixAppPrefs";
    private static final String KEY_SERVER_URL = "server_url";
    private static final String DEFAULT_URL = "http://localhost:3000/login";

    private WebView webView;
    private ProgressBar progressBar;
    private LinearLayout connectionOverlay;
    private EditText urlInput;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.setStatusBarColor(Color.parseColor("#0F253E"));
            window.setNavigationBarColor(Color.parseColor("#0F253E"));
        }

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#0F253E"));

        webView = new WebView(this);
        setupWebView(webView);
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                8,
                Gravity.TOP
        );
        root.addView(progressBar, progressParams);

        connectionOverlay = buildConnectionOverlay();
        connectionOverlay.setVisibility(View.GONE);
        root.addView(connectionOverlay, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        setContentView(root);

        String targetUrl = resolveInitialUrl(getIntent());
        urlInput.setText(targetUrl);
        webView.loadUrl(targetUrl);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        String targetUrl = resolveInitialUrl(intent);
        urlInput.setText(targetUrl);
        connectionOverlay.setVisibility(View.GONE);
        webView.loadUrl(targetUrl);
    }

    private String resolveInitialUrl(Intent intent) {
        if (intent != null && Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri data = intent.getData();
            if (data != null) {
                String paramUrl = data.getQueryParameter("url");
                if (paramUrl != null && !paramUrl.trim().isEmpty()) {
                    String normalized = ensureLoginLandingUrl(paramUrl.trim());
                    saveServerUrl(normalized);
                    return normalized;
                }
            }
        }
        return ensureLoginLandingUrl(prefs.getString(KEY_SERVER_URL, DEFAULT_URL));
    }

    private String ensureLoginLandingUrl(String rawUrl) {
        try {
            Uri uri = Uri.parse(rawUrl);
            String path = uri.getPath();
            if (path == null || path.isEmpty() || "/".equals(path)) {
                return uri.buildUpon().path("/login").build().toString();
            }
        } catch (Exception ignored) {
        }
        return rawUrl;
    }

    private void saveServerUrl(String url) {
        prefs.edit().putString(KEY_SERVER_URL, url).apply();
    }

    private void setupWebView(WebView view) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        String defaultUa = settings.getUserAgentString();
        settings.setUserAgentString(defaultUa + " WishPixAndroidWrapper/1.0");

        CookieManager.getInstance().setAcceptCookie(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            CookieManager.getInstance().setAcceptThirdPartyCookies(view, true);
        }

        view.setBackgroundColor(Color.parseColor("#0F253E"));

        view.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        view.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && request.isForMainFrame()) {
                    connectionOverlay.setVisibility(View.VISIBLE);
                }
            }
        });
    }

    private LinearLayout buildConnectionOverlay() {
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setGravity(Gravity.CENTER);
        container.setBackgroundColor(Color.parseColor("#0F253E"));
        int pad = dpToPx(24);
        container.setPadding(pad, pad, pad, pad);

        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundColor(Color.parseColor("#0D223B"));
        int cardPad = dpToPx(22);
        card.setPadding(cardPad, cardPad, cardPad, cardPad);

        TextView badge = new TextView(this);
        badge.setText("WISHPIX TEACHER APP");
        badge.setTextColor(Color.parseColor("#38BDF8"));
        badge.setTextSize(11);
        card.addView(badge);

        TextView title = new TextView(this);
        title.setText("Connect to WishPix Server");
        title.setTextColor(Color.WHITE);
        title.setTextSize(20);
        title.setPadding(0, dpToPx(6), 0, dpToPx(6));
        card.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("Enter your WishPix web app URL or classroom server address (e.g. https://your-domain.com or http://192.168.1.100:3000/login):");
        subtitle.setTextColor(Color.parseColor("#94A8BE"));
        subtitle.setTextSize(13);
        subtitle.setPadding(0, 0, 0, dpToPx(14));
        card.addView(subtitle);

        urlInput = new EditText(this);
        urlInput.setTextColor(Color.WHITE);
        urlInput.setHintTextColor(Color.parseColor("#64748B"));
        urlInput.setHint("https://...");
        urlInput.setBackgroundColor(Color.parseColor("#081729"));
        int inputPad = dpToPx(12);
        urlInput.setPadding(inputPad, inputPad, inputPad, inputPad);
        urlInput.setSingleLine(true);
        card.addView(urlInput);

        Button connectBtn = new Button(this);
        connectBtn.setText("Connect & Launch WishPix");
        connectBtn.setTextColor(Color.WHITE);
        connectBtn.setBackgroundColor(Color.parseColor("#0077C8"));
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        btnParams.topMargin = dpToPx(14);
        connectBtn.setLayoutParams(btnParams);
        connectBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String entered = urlInput.getText().toString().trim();
                if (!entered.isEmpty()) {
                    if (!entered.startsWith("http://") && !entered.startsWith("https://")) {
                        entered = "https://" + entered;
                    }
                    String normalized = ensureLoginLandingUrl(entered);
                    urlInput.setText(normalized);
                    saveServerUrl(normalized);
                    connectionOverlay.setVisibility(View.GONE);
                    webView.loadUrl(normalized);
                }
            }
        });
        card.addView(connectBtn);

        container.addView(card, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        return container;
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    @Override
    public void onBackPressed() {
        if (connectionOverlay.getVisibility() == View.VISIBLE) {
            connectionOverlay.setVisibility(View.GONE);
            return;
        }
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }
}
