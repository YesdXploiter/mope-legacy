package me.yesd;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

public class Config {
    private static String configfile = "config.txt";
    public static Properties prop = new Properties();

    public void SaveProp(String title, String value) {
        try {
            prop.setProperty(title, value);
            prop.store(new FileOutputStream(configfile), null);
        } catch (IOException e) {
            //
        }
    }

    public String GetProp(String title, String defaultvalue) {
        String p = defaultvalue;
        try {
            prop.load(new FileInputStream(configfile));
            String a = prop.getProperty(title);
            if (a == null)
                this.SaveProp(title, p);
            else
                p = a;
        } catch (IOException e) {
            this.SaveProp(title, p);
        }
        return p.trim();
    }
}
