import { db } from "../config/db.js";

// headless CMS

export const findAllContent = async () => {
  const [rows] = await db.query(`SELECT site_content.*, media.url AS media_url, media.alt AS media_alt FROM site_content LEFT JOIN media ON site_content.media_id = media.id `);
  return rows
};

export const findContentByPage = async (pageName) => {
  const [rows] = await db.query(
    `SELECT site_content.*, media.url AS media_url, media.alt AS media_alt FROM site_content LEFT JOIN media ON site_content.media_id = media.id 
    WHERE site_content.page = ?;`, [pageName]
  );
  return rows
};

export const findContentByKey = async (keyName) => {
  const [rows] = await db.query(
    `SELECT site_content.*, media.url AS media_url, media.alt AS media_alt 
     FROM site_content 
     LEFT JOIN media ON site_content.media_id = media.id
     WHERE site_content.key_name = ?`,
    [keyName]
  )
  return rows[0]
}

export const updateContentByKey = async (keyName, value, mediaId) => {
  const [result] = await db.query(
    `UPDATE site_content SET value = ?, media_id = ? WHERE key_name = ?`,
    [value, mediaId, keyName]
  )
  return result.affectedRows
}

